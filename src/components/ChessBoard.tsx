
import React, { useState, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChessBoardProps {
  onPositionChange?: (fen: string) => void;
  highlightSquare?: string;
  targetSquare?: string;
  boardWidth?: number;
  isDarkMode?: boolean;
}

const ChessBoard = ({ 
  onPositionChange, 
  highlightSquare,
  targetSquare,
  boardWidth = 500,
  isDarkMode = false
}: ChessBoardProps) => {
  // Create a new game instance that persists during component lifetime
  const [game, setGame] = useState<Chess>(new Chess());
  const [arePiecesDraggable, setArePiecesDraggable] = useState(true);

  useEffect(() => {
    if (onPositionChange) {
      onPositionChange(game.fen());
    }
  }, [game, onPositionChange]);

  function onDrop(sourceSquare: string, targetSquare: string) {
    try {
      // Try to make the move
      const moveConfig = {
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to a queen for simplicity
      };
      
      // Make a copy of the current game state
      const gameCopy = new Chess(game.fen());
      
      // Try to make the move
      const move = gameCopy.move(moveConfig);

      // If move is invalid
      if (move === null) return false;
      
      // Update the game state with the new position
      setGame(gameCopy);
      
      // Return true to indicate the move was valid
      return true;
    } catch (e) {
      console.error('Error making move:', e);
      return false;
    }
  }

  function resetBoard() {
    setGame(new Chess());
  }
  
  // Custom pieces with highlight effect
  const customSquareStyles = {
    ...(highlightSquare && {
      [highlightSquare]: {
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(54, 146, 231, 0.5)',
          borderRadius: '50%',
          transform: 'scale(0.7)',
        },
      }
    }),
    ...(targetSquare && {
      [targetSquare]: {
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(105, 170, 64, 0.5)',
          borderRadius: '50%',
          transform: 'scale(0.7)',
        },
      }
    })
  };

  // Create the custom pieces highlights using HTML overlay
  const customSquareRenderers = () => {
    const elements: React.ReactNode[] = [];
    
    if (highlightSquare) {
      elements.push(
        <div 
          key="highlight"
          style={{
            position: 'absolute',
            top: `${(8 - parseInt(highlightSquare[1])) * 12.5}%`,
            left: `${(highlightSquare.charCodeAt(0) - 97) * 12.5}%`,
            width: '12.5%',
            height: '12.5%',
            pointerEvents: 'none',
            backgroundColor: 'rgba(54, 146, 231, 0.5)',
            borderRadius: '50%',
            transform: 'scale(0.7)',
            zIndex: 1
          }}
        />
      );
    }
    
    if (targetSquare) {
      elements.push(
        <div 
          key="target"
          style={{
            position: 'absolute',
            top: `${(8 - parseInt(targetSquare[1])) * 12.5}%`,
            left: `${(targetSquare.charCodeAt(0) - 97) * 12.5}%`,
            width: '12.5%',
            height: '12.5%',
            pointerEvents: 'none',
            backgroundColor: 'rgba(105, 170, 64, 0.5)',
            borderRadius: '50%',
            transform: 'scale(0.7)',
            zIndex: 1
          }}
        />
      );
    }
    
    return elements;
  };
  
  return (
    <div className="relative">
      <div style={{ width: boardWidth }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Chessboard
                id="StandardBoard"
                position={game.fen()}
                onPieceDrop={onDrop}
                boardWidth={boardWidth}
                arePiecesDraggable={arePiecesDraggable}
                customBoardStyle={{
                  borderRadius: "4px",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)"
                }}
                customDarkSquareStyle={{ backgroundColor: isDarkMode ? '#769656' : '#b58863' }}
                customLightSquareStyle={{ backgroundColor: isDarkMode ? '#eeeed2' : '#f0d9b5' }}
              />
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {customSquareRenderers()}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Drag pieces to move
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChessBoard;
