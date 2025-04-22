
import React, { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, RotateCw, RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import ChessBoard from './ChessBoard';
import MoveEvaluation from './MoveEvaluation';
import StockfishService from '../services/StockfishService';

interface ChessAnalyzerProps {
  initialFen?: string;
  isDarkMode?: boolean;
}

const ChessAnalyzer: React.FC<ChessAnalyzerProps> = ({ 
  initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  isDarkMode = false 
}) => {
  const [fen, setFen] = useState(initialFen);
  const [game, setGame] = useState(new Chess(initialFen));
  const [boardWidth, setBoardWidth] = useState(500);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bestMove, setBestMove] = useState({ from: '', to: '' });
  const [evaluation, setEvaluation] = useState<number | string>(0);
  const [evaluationUnit, setEvaluationUnit] = useState('cp');
  const [moveText, setMoveText] = useState('');
  const [depth, setDepth] = useState(15);
  const [boardOrientation, setBoardOrientation] = useState('white');
  
  const { toast } = useToast();
  
  // Adjust board size on window resize
  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(500, window.innerWidth - 40);
      setBoardWidth(width);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handlePositionChange = useCallback((newFen: string) => {
    setFen(newFen);
    setGame(new Chess(newFen));
    
    // Reset analysis when position changes
    setBestMove({ from: '', to: '' });
    setEvaluation(0);
    setEvaluationUnit('cp');
    setMoveText('');
    setIsAnalyzing(false);
  }, []);
  
  const analyzePosition = useCallback(() => {
    setIsAnalyzing(true);
    setBestMove({ from: '', to: '' });
    setEvaluation(0);
    setMoveText('');
    
    toast({
      title: "Starting analysis",
      description: `Analyzing position at depth ${depth}...`,
    });
    
    StockfishService.analyze(fen, depth, (data) => {
      if (data.type === 'bestmove' && data.bestMove) {
        const from = data.bestMove.substring(0, 2);
        const to = data.bestMove.substring(2, 4);
        setBestMove({ from, to });
        setMoveText(StockfishService.translateMoveToText(data.bestMove, game));
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis complete",
          description: "Best move found",
        });
      } else if (data.type === 'evaluation') {
        const evalData = StockfishService.parseEvaluation(data.data);
        setEvaluation(evalData.score);
        setEvaluationUnit(evalData.unit);
      }
    });
  }, [fen, depth, game, toast]);
  
  const flipBoard = () => {
    setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white');
  };
  
  const resetAnalysis = () => {
    StockfishService.stop();
    setFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    setGame(new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));
    setBestMove({ from: '', to: '' });
    setEvaluation(0);
    setEvaluationUnit('cp');
    setMoveText('');
    setIsAnalyzing(false);
    
    toast({
      title: "Board reset",
      description: "Starting position restored",
    });
  };
  
  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-[560px] mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Chess Position</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={flipBoard} title="Flip board">
                {boardOrientation === 'white' ? 
                  <RotateCw className="h-4 w-4" /> : 
                  <RotateCcw className="h-4 w-4" />
                }
              </Button>
              <Button variant="outline" size="icon" onClick={resetAnalysis} title="Reset board">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <ChessBoard
            onPositionChange={handlePositionChange}
            highlightSquare={bestMove.from}
            targetSquare={bestMove.to}
            boardWidth={boardWidth}
            isDarkMode={isDarkMode}
          />
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-[560px] mb-4">
        <CardHeader>
          <CardTitle>Analysis Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span>Analysis Depth: {depth}</span>
                <span className="text-muted-foreground text-sm">
                  {depth < 10 ? 'Fast' : depth > 20 ? 'Deep' : 'Balanced'}
                </span>
              </div>
              <Slider 
                min={5}
                max={25}
                step={1}
                value={[depth]}
                onValueChange={(value) => setDepth(value[0])}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={analyzePosition} 
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className="mr-2">Analyzing...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                </>
              ) : 'Analyze Position'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-[560px]">
        <CardHeader>
          <CardTitle>Best Move</CardTitle>
        </CardHeader>
        <CardContent>
          <MoveEvaluation
            moveFrom={bestMove.from}
            moveTo={bestMove.to}
            evaluation={evaluation}
            evaluationUnit={evaluationUnit}
            moveText={moveText}
            isLoading={isAnalyzing}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChessAnalyzer;
