
import { Chess } from 'chess.js';

class StockfishService {
  private worker: Worker | null = null;
  private isReady = false;
  private onMessageCallback: ((data: any) => void) | null = null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.worker = new Worker(new URL('stockfish/stockfish.js', import.meta.url));
        
        this.worker.onmessage = (e) => {
          if (e.data === 'uciok') {
            this.isReady = true;
            this.sendCommand('isready');
          }
          else if (e.data === 'readyok') {
            console.log('Stockfish engine is ready');
          }
          else if (e.data.startsWith('bestmove')) {
            if (this.onMessageCallback) {
              const parts = e.data.split(' ');
              const bestMove = parts[1];
              let ponder = null;
              if (parts.length > 3) {
                ponder = parts[3];
              }
              this.onMessageCallback({ type: 'bestmove', bestMove, ponder });
            }
          }
          else if (e.data.includes('score')) {
            if (this.onMessageCallback) {
              this.onMessageCallback({ type: 'evaluation', data: e.data });
            }
          }
        };
        
        this.sendCommand('uci');
      } catch (error) {
        console.error('Failed to initialize Stockfish:', error);
      }
    }
  }

  public analyze(fen: string, depth: number = 15, callback: (data: any) => void): void {
    if (!this.worker) {
      console.error('Stockfish worker not initialized');
      return;
    }
    
    this.onMessageCallback = callback;
    
    // Configure Stockfish
    this.sendCommand('ucinewgame');
    this.sendCommand(`position fen ${fen}`);
    this.sendCommand(`go depth ${depth}`);
  }

  public stop(): void {
    if (this.worker) {
      this.sendCommand('stop');
    }
  }

  private sendCommand(cmd: string): void {
    if (this.worker) {
      this.worker.postMessage(cmd);
    }
  }
  
  public parseEvaluation(data: string): { score: number | string, unit: string } {
    try {
      // Default values
      let score = 0;
      let unit = 'cp';
      
      // Look for evaluation score
      if (data.includes('score cp')) {
        const cpMatch = data.match(/score cp (-?\d+)/);
        if (cpMatch && cpMatch[1]) {
          score = parseInt(cpMatch[1]) / 100; // Convert centipawns to pawns
          unit = 'cp';
        }
      }
      else if (data.includes('score mate')) {
        const mateMatch = data.match(/score mate (-?\d+)/);
        if (mateMatch && mateMatch[1]) {
          score = parseInt(mateMatch[1]);
          unit = 'mate';
        }
      }
      
      return { score, unit };
    } catch (error) {
      console.error('Error parsing evaluation:', error);
      return { score: 0, unit: 'cp' };
    }
  }
  
  public translateMoveToText(move: string, game: Chess): string {
    try {
      const from = move.substring(0, 2);
      const to = move.substring(2, 4);
      
      // Get piece at source square
      const piece = game.get(from);
      if (!piece) return move;
      
      const pieceSymbols: Record<string, string> = {
        p: 'Pawn',
        n: 'Knight',
        b: 'Bishop',
        r: 'Rook',
        q: 'Queen',
        k: 'King',
      };
      
      const pieceType = pieceSymbols[piece.type] || '';
      return `${pieceType} ${from} to ${to}`;
    } catch (error) {
      return move;
    }
  }
}

export default new StockfishService();
