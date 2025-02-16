import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const QuizList = ({ companyName }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = companyName 
        ? `http://localhost:8070/api/quizzes?company_name=${encodeURIComponent(companyName)}`
        : 'http://localhost:8070/api/quizzes';
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQuizzes(data.quizzes);
    } catch (error) {
      setError("Failed to fetch quizzes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [companyName]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold">Generated Quizzes</CardTitle>
        <Button 
          variant="outline" 
          size="icon"
          onClick={fetchQuizzes}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="rounded-md border">
          <div className="grid grid-cols-4 gap-4 p-4 font-medium text-sm text-gray-500 bg-gray-50 rounded-t-md">
            <div>Quiz Name</div>
            <div>Document</div>
            <div>Company</div>
            <div>Created At</div>
          </div>
          
          <div className="divide-y">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-gray-50">
                <div className="font-medium">{quiz.quiz_name}</div>
                <div>{quiz.document_name}</div>
                <div>{quiz.company_name}</div>
                <div>{formatDate(quiz.created_at)}</div>
              </div>
            ))}
          </div>
        </div>

        {quizzes.length === 0 && !loading && !error && (
          <div className="text-center py-8 text-gray-500">
            No quizzes found
          </div>
        )}
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading quizzes...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizList;


// Configure the environment variables in .env
// DB_URL=postgresql://user:password@localhost:5432/dbname
// LOG_LEVEL=INFO

// Add the QuizList component to your React application

// Start the service using "uvicorn main:app --reload"