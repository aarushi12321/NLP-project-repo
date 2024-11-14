import React, { useEffect, useRef } from 'react';
import WordCloud from 'wordcloud';

export function CircularWordCloud({ wordCloud }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && wordCloud) {
      WordCloud(canvasRef.current, {
        list: wordCloud.map((word) => [word.text, word.value]),
        gridSize: 12,
        weightFactor: 20,
        fontFamily: 'Verdana',
        color: 'random-dark',
        rotateRatio: 0.5,
        rotationSteps: 2, 
        backgroundColor: 'transparent',
        shape: 'circle',
        drawOutOfBound: false, 
      });
    }
  }, [wordCloud]);

  return <canvas ref={canvasRef} width={300} height={300} />;
}
