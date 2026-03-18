import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function DailyKickoff({ onUnlock, techName }) {
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkQuizStatus();
  }, []);

  const checkQuizStatus = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data: reward } = await supabase
      .from('crew_rewards')
      .select('last_quiz_date')
      .eq('tech_name', techName)
      .single();

    if (reward?.last_quiz_date === today) {
      onUnlock();
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('gibmp_quiz')
      .select('*')
      .eq('is_active', true)
      .order('random()')
      .limit(1)
      .single();

    setQuiz(data);
    setLoading(false);
  };

  const handleAnswer = async (index) => {
    setSelected(index);
    const isCorrect = index === quiz.correct_index;
    setResult(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      await supabase.rpc('award_quiz_points', {
        p_tech_name: techName,
        p_points: quiz.points_value
      });
      setTimeout(() => onUnlock(), 1000);
    }
  };

  if (loading) return <div>Loading Daily Quiz...</div>;
  if (!quiz) return null;

  return (
    <div className="quiz-modal">
      <h2>Daily Safety Quiz</h2>
      <p>{quiz.question}</p>
      {quiz.choices.map((choice, idx) => (
        <button
          key={idx}
          onClick={() => handleAnswer(idx)}
          className={selected === idx ? (idx === quiz.correct_index ? 'correct' : 'wrong') : ''}
        >
          {choice}
        </button>
      ))}
      {result === 'correct' && <p className="success">Correct! +{quiz.points_value} points</p>}
      {result === 'incorrect' && <p className="error">Incorrect. Try again.</p>}
    </div>
  );
}
