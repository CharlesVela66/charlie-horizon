'use client';

import React from 'react';
import CountUp from 'react-countup';

const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full total-balance-amount flex-center gap-2">
      <CountUp decimals={2} decimal="." prefix="$" end={amount} />
    </div>
  );
};

export default AnimatedCounter;
