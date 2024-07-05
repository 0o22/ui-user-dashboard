'use client';

import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useErrorContext } from '@/contexts/Error/ErrorContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signOut } from 'next-auth/react';
import Loader from '@/components/Loader';

interface QuestionsWithAnswers {
  question: string;
  answer?: string;
}

export default function QuestionsDialog() {
  const [questions, setQuestions] = useState<QuestionsWithAnswers[]>([]);
  const [timer, setTimer] = useLocalStorage('timer', 0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setError } = useErrorContext();

  useEffect(() => {
    if (isOpen) {
      return;
    }

    const t = setInterval(() => {
      setTimer((current) => current + 1);
    }, 1000);

    return () => {
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, setTimer]);

  useEffect(() => {
    const duration = 240; //* in seconds

    if (timer < duration) {
      return;
    }

    const getQuestions = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/get-questions`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          next: { revalidate: 0 },
        }
      );

      if (!response.ok) {
        setError(new Error('Failed to fetch questions'));

        return;
      }

      const questions = await response.json();

      return questions;
    };

    getQuestions().then(setQuestions);
    setIsOpen(true);
  }, [timer, setError]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/check-answers`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ responses: questions }),
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      setIsSubmitting(false);
      signOut({ callbackUrl: '/login' });

      return;
    }

    setIsSubmitting(false);
    setIsOpen(false);
    setTimer(0);
  };

  const onInputChange = (questionNumber: number, value: string) => {
    setQuestions((currentQuestions) => {
      const updatedQuestions = [...currentQuestions];

      updatedQuestions[questionNumber - 1].answer = value;

      return updatedQuestions;
    });
  };

  const isEveryFieldHasAnswers = questions.every(
    ({ answer }) => answer && answer.length > 0
  );

  return (
    <AlertDialog open={isOpen && questions.length > 0}>
      <AlertDialogContent className="w-full max-w-[600px] text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Answer the questions to continue</AlertDialogTitle>

          <AlertDialogDescription>
            Please enter the answers to verify your identity.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          {questions.map(({ question }, index) => {
            const questionNumber = index + 1;
            const questionKey = questionNumber.toString();

            return (
              <div key={questionNumber.toString()} className="space-y-1">
                <Label htmlFor={questionKey}>{question}</Label>

                <Input
                  id={questionKey}
                  name={questionKey}
                  placeholder={`Enter your answer to question ${questionNumber}`}
                  value={questions[index].answer || ''}
                  onChange={(event) => {
                    onInputChange(questionNumber, event.target.value);
                  }}
                />
              </div>
            );
          })}

          <AlertDialogFooter>
            <Button
              className="w-full sm:max-w-32"
              type="submit"
              disabled={!isEveryFieldHasAnswers || isSubmitting}
            >
              {isSubmitting ? <Loader /> : 'Check answers'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
