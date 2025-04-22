
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from 'lucide-react';

interface MoveEvaluationProps {
  moveFrom: string;
  moveTo: string;
  evaluation: number | string;
  evaluationUnit: string;
  moveText: string;
  isLoading: boolean;
}

const MoveEvaluation: React.FC<MoveEvaluationProps> = ({
  moveFrom,
  moveTo,
  evaluation,
  evaluationUnit,
  moveText,
  isLoading
}) => {
  const getEvaluationText = () => {
    if (evaluationUnit === 'mate') {
      return `Mate in ${Math.abs(Number(evaluation))}`;
    } else {
      let evalNum = Number(evaluation);
      let evalText = evalNum.toFixed(2);
      if (evalNum > 0) evalText = '+' + evalText;
      return evalText;
    }
  };

  const getEvaluationColor = () => {
    if (evaluationUnit === 'mate') {
      return 'bg-red-500';
    } 
    
    if (typeof evaluation === 'number') {
      if (evaluation > 3) return 'bg-green-500';
      if (evaluation > 1.5) return 'bg-green-400';
      if (evaluation > 0.5) return 'bg-green-300';
      if (evaluation > -0.5) return 'bg-gray-400';
      if (evaluation > -1.5) return 'bg-orange-300';
      if (evaluation > -3) return 'bg-orange-400';
      return 'bg-red-400';
    }
    
    return 'bg-gray-400';
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Best Move:</h3>
        <Badge className={getEvaluationColor()}>
          <span className="monospace font-semibold">{getEvaluationText()}</span>
        </Badge>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-12">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-primary"></div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">{moveFrom}</Badge>
            <ArrowRight className="h-5 w-5 mx-1" />
            <Badge variant="outline">{moveTo}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">{moveText}</div>
        </div>
      )}
    </Card>
  );
};

export default MoveEvaluation;
