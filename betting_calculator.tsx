import React, { useState, useEffect } from 'react';

// Utility function for className merging
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Select Component
const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg bg-gray-900/50 border border-cyan-500/30 text-cyan-100 px-4 py-2 text-sm shadow-lg backdrop-blur-sm transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none hover:border-cyan-400/50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

// Label Component
const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-cyan-100 tracking-wide uppercase", className)}
      {...props}
    />
  );
});
Label.displayName = "Label";

// Input Component
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg bg-gray-900/50 border border-cyan-500/30 text-cyan-100 px-4 py-2 text-sm shadow-lg backdrop-blur-sm transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none hover:border-cyan-400/50 placeholder:text-cyan-300/50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Button Component
const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider";
  
  const variants = {
    default: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95",
    secondary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95",
    ghost: "text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300",
  };
  
  const sizes = {
    default: "h-10 px-6 py-2",
    sm: "h-8 rounded-md px-4 text-xs",
    lg: "h-12 rounded-lg px-8",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Checkbox Component
const Checkbox = React.forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      checked={!!checked}
      onChange={onChange}
      className={cn(
        "h-5 w-5 rounded border-2 border-cyan-400/50 bg-gray-900/50 text-cyan-400 shadow-lg focus:ring-2 focus:ring-cyan-400/30 focus:ring-offset-0 transition-all duration-200 cursor-pointer accent-cyan-400",
        className
      )}
      {...props}
    />
  );
});
Checkbox.displayName = "Checkbox";

// House Card Component
function HouseCard({ index, data, updateHouse, fixStake }) {
  return (
    <div className="bg-gray-900/40 backdrop-blur-md rounded-xl p-3 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/15 hover:border-cyan-400/30 transition-all duration-300 h-full">
      <h3 className="text-cyan-400 text-sm mb-2 font-bold uppercase tracking-wider text-center">
        Casa {index + 1}
      </h3>
      <div className="space-y-2">
        {/* Odd and Odd Final in same row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`odd-${index}`} className="text-cyan-200 mb-1 block text-xs">
              Odd
            </Label>
            <Input
              id={`odd-${index}`}
              type="number"
              min="1"
              step="0.01"
              value={data.odd}
              onChange={(e) => {
                const oddValue = e.target.value;
                const updates = { odd: oddValue };
                
                if (data.lay) {
                  const stakeValue = parseFloat(data.stake) || 0;
                  const oddNum = parseFloat(oddValue) || 0;
                  if (stakeValue > 0 && oddNum > 1) {
                    updates.responsibility = (stakeValue * (oddNum - 1)).toFixed(2);
                  }
                }
                updateHouse(updates);
              }}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-cyan-200 mb-1 block text-xs">
              Odd Final
            </Label>
            <div className="h-8 flex items-center px-3 bg-gray-800/60 border border-cyan-500/20 rounded-lg text-xs text-cyan-100 font-mono">
              {data.finalOdd.toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* Responsibility field for Lay bets */}
        {data.lay && (
          <div>
            <Label htmlFor={`responsibility-${index}`} className="text-cyan-200 mb-1 block text-xs">
              Responsabilidade
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300 text-xs font-bold">
                R$
              </span>
              <Input
                id={`responsibility-${index}`}
                type="number"
                min="0"
                step="0.01"
                value={data.responsibility}
                onChange={(e) => {
                  const respValue = e.target.value;
                  const updates = { responsibility: respValue };
                  
                  if (data.lay) {
                    const oddValue = parseFloat(data.odd) || 0;
                    const respNum = parseFloat(respValue) || 0;
                    if (respNum > 0 && oddValue > 1) {
                      updates.stake = (respNum / (oddValue - 1)).toFixed(2);
                    } else {
                      updates.stake = "";
                    }
                  }
                  updateHouse(updates);
                }}
                className="pl-10 h-8 text-xs font-mono"
              />
            </div>
          </div>
        )}
        
        {/* Stake and B/L button */}
        <div>
          <Label htmlFor={`stake-${index}`} className="text-cyan-200 mb-1 block text-xs">
            Stake
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300 text-xs font-bold">
                R$
              </span>
              <Input
                id={`stake-${index}`}
                type="number"
                min="0"
                step="0.01"
                value={data.stake}
                onChange={(e) => {
                  const stakeValue = e.target.value;
                  const updates = { stake: stakeValue };
                  
                  if (data.lay) {
                    const oddValue = parseFloat(data.odd) || 0;
                    const stakeNum = parseFloat(stakeValue) || 0;
                    if (stakeNum > 0 && oddValue > 1) {
                      updates.responsibility = (stakeNum * (oddValue - 1)).toFixed(2);
                    }
                  }
                  updateHouse(updates);
                }}
                className="pl-10 h-8 text-xs font-mono"
              />
            </div>
            <Button
              variant={data.lay ? "secondary" : "default"}
              size="sm"
              className="w-10 h-8 p-0 text-xs font-black"
              onClick={() => {
                if (data.lay) {
                  updateHouse({ lay: false });
                } else {
                  const stakeValue = parseFloat(data.stake) || 0;
                  const oddValue = parseFloat(data.odd) || 0;
                  const updates = { lay: true };
                  
                  if (stakeValue > 0 && oddValue > 1) {
                    updates.responsibility = (stakeValue * (oddValue - 1)).toFixed(2);
                  }
                  updateHouse(updates);
                }
              }}
            >
              {data.lay ? "L" : "B"}
            </Button>
          </div>
        </div>
        
        {/* Checkboxes in same row */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-1">
            <Checkbox
              id={`commission-${index}`}
              checked={data.commission !== null}
              onChange={(e) => updateHouse({ commission: e.target.checked ? 0 : null })}
            />
            <Label htmlFor={`commission-${index}`} className="text-cyan-200 text-xs normal-case">
              Comissão
            </Label>
          </div>
          
          <div className="flex items-center space-x-1">
            <Checkbox
              id={`freebet-${index}`}
              checked={data.freebet}
              onChange={(e) => updateHouse({ freebet: e.target.checked })}
            />
            <Label htmlFor={`freebet-${index}`} className="text-cyan-200 text-xs normal-case">
              Freebet
            </Label>
          </div>
        </div>
        
        {/* Commission value field */}
        {data.commission !== null && (
          <div>
            <Label htmlFor={`commission-value-${index}`} className="text-cyan-200 text-xs mb-1 block">
              Comissão (%)
            </Label>
            <div className="relative">
              <Input
                id={`commission-value-${index}`}
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={data.commission === 0 ? "" : data.commission.toString()}
                onChange={(e) => {
                  const commValue = e.target.value;
                  if (commValue === "") {
                    updateHouse({ commission: 0 });
                  } else {
                    const commNum = parseFloat(commValue);
                    if (!isNaN(commNum)) {
                      updateHouse({ commission: commNum });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    updateHouse({ commission: 0 });
                  }
                }}
                className="pr-10 h-8 text-xs font-mono"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300 text-xs font-bold">
                %
              </span>
            </div>
          </div>
        )}
        
        <Button
          size="sm"
          className={cn(
            "w-full h-8 text-xs",
            data.fixedStake 
              ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/25" 
              : "bg-gradient-to-r from-gray-600 to-gray-700 shadow-gray-600/25"
          )}
          onClick={fixStake}
        >
          {data.fixedStake ? "Stake Fixa" : "Fixar Stake"}
        </Button>
      </div>
    </div>
  );
}

// Main Calculator Component
function Calculator() {
  const [numHouses, setNumHouses] = useState(2);
  const [roundingValue, setRoundingValue] = useState(0.01);
  const [displayRounding, setDisplayRounding] = useState("0.01");
  const [houses, setHouses] = useState(() => 
    Array(6).fill(null).map((_, index) => ({
      odd: "",
      increase: "",
      finalOdd: 0,
      stake: "0",
      commission: null,
      freebet: false,
      fixedStake: index === 0,
      lay: false,
      responsibility: ""
    }))
  );
  const [manualOverrides, setManualOverrides] = useState({});
  const [results, setResults] = useState({
    profits: [],
    totalStake: 0,
    roi: 0
  });

  // Function to round stake values
  const roundStake = (value) => {
    if (!value || isNaN(value)) return value;
    const numValue = parseFloat(value);
    const rounded = Math.round(numValue / roundingValue) * roundingValue;
    return rounded.toFixed(2);
  };

  useEffect(() => {
    if (houses.length === 0) return;

    const activeHouses = houses.slice(0, numHouses);
    const fixedIndex = activeHouses.findIndex(house => house.fixedStake);
    
    if (fixedIndex === -1) {
      calculateResults(activeHouses);
      return;
    }

    const fixedHouse = activeHouses[fixedIndex];
    const fixedStake = parseFloat(fixedHouse.stake) || 0;
    const fixedOdd = fixedHouse.finalOdd;
    
    if (fixedStake <= 0 || fixedOdd <= 0) {
      calculateResults(activeHouses);
      return;
    }

    let newHouses = [...houses];
    let hasChanges = false;

    activeHouses.forEach((house, index) => {
      const overrides = manualOverrides[index] || {};
      const oddValue = parseFloat(house.odd) || 0;
      const stakeValue = parseFloat(house.stake) || 0;

      // Update responsibility for lay bets
      if (house.lay && !overrides.responsibility && oddValue > 1 && stakeValue > 0) {
        const responsibility = stakeValue * (oddValue - 1);
        if (Math.abs(parseFloat(house.responsibility) - responsibility) > 0.01) {
          hasChanges = true;
          newHouses[index] = {
            ...house,
            responsibility: responsibility.toFixed(2)
          };
        }
      }

      // Calculate stakes for non-fixed houses
      if (index !== fixedIndex && house.finalOdd > 0 && !overrides.stake) {
        const fixedCommission = fixedHouse.commission || 0;
        const houseCommission = house.commission || 0;
        const fixedProfit = fixedStake * fixedOdd * (1 - fixedCommission / 100);
        
        let calculatedStake;
        if (house.lay) {
          calculatedStake = fixedProfit / (house.finalOdd - houseCommission / 100);
        } else {
          // For back bets, apply commission to the odd first
          const effectiveOdd = house.finalOdd * (1 - houseCommission / 100);
          calculatedStake = fixedProfit / effectiveOdd;
        }

        // Apply rounding only for Back bets, not Lay bets
        let finalStake;
        if (house.lay) {
          // For Lay bets, don't apply rounding - keep full precision
          finalStake = calculatedStake.toFixed(2);
        } else {
          // For Back bets, apply rounding
          finalStake = roundStake(calculatedStake);
        }

        if (Math.abs((parseFloat(house.stake) || 0) - parseFloat(finalStake)) > 0.01) {
          hasChanges = true;
          if (house.lay) {
            const responsibility = parseFloat(finalStake) * (oddValue - 1);
            newHouses[index] = {
              ...house,
              stake: finalStake,
              responsibility: responsibility.toFixed(2),
              fixedStake: false
            };
          } else {
            newHouses[index] = {
              ...house,
              stake: finalStake,
              fixedStake: false
            };
          }
        }
      }
    });

    if (hasChanges) {
      setHouses(newHouses);
    } else {
      calculateResults(activeHouses);
    }
  }, [houses, numHouses, manualOverrides, roundingValue]);

  const calculateResults = (activeHouses) => {
    let totalStake = 0;
    let totalFreebetValue = 0;
    const profits = [];

    // Calculate total stake and freebet values separately
    activeHouses.forEach(house => {
      if (house.freebet) {
        totalFreebetValue += parseFloat(house.stake) || 0;
      } else {
        if (house.lay) {
          totalStake += parseFloat(house.responsibility) || 0;
        } else {
          totalStake += parseFloat(house.stake) || 0;
        }
      }
    });

    // Calculate profits for each house
    activeHouses.forEach((house, index) => {
      const stakeValue = parseFloat(house.stake) || 0;
      const oddValue = house.finalOdd || 0;
      const commission = house.commission || 0;

      if (house.lay) {
        const responsibility = parseFloat(house.responsibility) || 0;
        const profit = stakeValue * (1 - commission / 100) - (totalStake - responsibility);
        profits[index] = profit;
      } else if (house.freebet) {
        const grossProfit = stakeValue * oddValue - totalStake;
        profits[index] = grossProfit - (grossProfit > 0 ? (commission / 100) * grossProfit : 0);
      } else {
        // For back bets: apply commission to the odd, reducing the effective payout
        const effectiveOdd = oddValue * (1 - commission / 100);
        const grossProfit = stakeValue * effectiveOdd - totalStake;
        profits[index] = grossProfit;
      }
    });

    const minProfit = Math.min(...profits);
    
    // Calculate ROI: if there are freebets, use only freebet value as denominator
    let roi;
    if (totalFreebetValue > 0) {
      roi = (minProfit / totalFreebetValue) * 100;
    } else {
      roi = totalStake > 0 ? (minProfit / totalStake) * 100 : 0;
    }

    setResults({
      profits,
      totalStake,
      roi
    });
  };

  const updateHouse = (index, updates) => {
    const newHouses = [...houses];
    const updatedHouse = { ...newHouses[index], ...updates };
    const newOverrides = { ...manualOverrides[index] };

    // Track manual overrides
    if (updates.stake !== undefined) newOverrides.stake = true;
    if (updates.responsibility !== undefined) newOverrides.responsibility = true;
    if (updates.odd !== undefined) newOverrides.odd = true;
    if (updates.commission !== undefined) newOverrides.commission = true;

    // Update odd and stake
    if (updates.odd !== undefined) updatedHouse.odd = updates.odd;
    if (updates.stake !== undefined) updatedHouse.stake = updates.stake;

    // Calculate final odd
    const oddValue = parseFloat(updatedHouse.odd) || 0;
    const increaseValue = parseFloat(updatedHouse.increase) || 0;

    if (updates.freebet === true || updatedHouse.freebet) {
      updatedHouse.finalOdd = Math.max(oddValue - 1, 0);
    } else {
      updatedHouse.finalOdd = oddValue * (1 + increaseValue / 100);
    }

    // Update responsibility for lay bets
    if (updatedHouse.lay && !newOverrides.responsibility && oddValue > 1) {
      const stakeValue = parseFloat(updatedHouse.stake) || 0;
      updatedHouse.responsibility = (stakeValue * (oddValue - 1)).toFixed(2);
    }

    newHouses[index] = updatedHouse;
    setManualOverrides({
      ...manualOverrides,
      [index]: newOverrides
    });
    setHouses(newHouses);
  };

  const fixStake = (index) => {
    const newHouses = [...houses];
    
    // Unfix all other houses
    newHouses.forEach((house, i) => {
      if (i !== index) {
        house.fixedStake = false;
      }
    });
    
    // Toggle fixed state of current house
    newHouses[index].fixedStake = !newHouses[index].fixedStake;
    
    setHouses(newHouses);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Section - Configuration and Results Cards */}
      <div className="grid grid-cols-4 gap-3">
        {/* Number of Houses */}
        <div className="bg-gray-900/40 backdrop-blur-md rounded-xl p-3 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          <h2 className="text-cyan-400 text-sm mb-2 font-bold uppercase tracking-wider text-center">Configurações</h2>
          <div>
            <Label className="text-cyan-200 mb-1 block text-xs">Número de Casas:</Label>
            <Select
              value={numHouses.toString()}
              onChange={(e) => setNumHouses(parseInt(e.target.value))}
              className="w-full h-8 text-xs"
            >
              <option value="2">2 Casas</option>
              <option value="3">3 Casas</option>
              <option value="4">4 Casas</option>
              <option value="5">5 Casas</option>
            </Select>
          </div>
        </div>

        {/* Rounding Settings */}
        <div className="bg-gray-900/40 backdrop-blur-md rounded-xl p-3 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          <h2 className="text-cyan-400 text-sm mb-2 font-bold uppercase tracking-wider text-center">Arredondamento</h2>
          <div>
            <Label className="text-cyan-200 mb-1 block text-xs">Stakes Para:</Label>
            <Select
              value={displayRounding}
              onChange={(e) => {
                const stringValue = e.target.value;
                const numValue = parseFloat(stringValue);
                setDisplayRounding(stringValue);
                setRoundingValue(numValue);
              }}
              className="w-full h-8 text-xs"
            >
              <option value="0.01">R$ 0,01</option>
              <option value="0.10">R$ 0,10</option>
              <option value="0.50">R$ 0,50</option>
              <option value="1.00">R$ 1,00</option>
            </Select>
          </div>
        </div>

        {/* Total Invested */}
        <div className="bg-gray-900/40 backdrop-blur-md rounded-xl p-3 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 text-center">
          <h2 className="text-cyan-400 text-sm mb-2 font-bold uppercase tracking-wider">Total Investido</h2>
          <div className="text-lg text-cyan-100 font-bold font-mono">
            R$ {results.totalStake.toFixed(2)}
          </div>
        </div>
        
        {/* ROI */}
        <div className="bg-gray-900/40 backdrop-blur-md rounded-xl p-3 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 text-center">
          <h2 className="text-cyan-400 text-sm mb-2 font-bold uppercase tracking-wider">ROI Médio</h2>
          <div className={cn(
            "text-lg font-bold font-mono",
            results.roi >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {results.roi >= 0 ? "+" : ""}{results.roi.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Houses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {houses.slice(0, numHouses).map((house, index) => (
          <HouseCard
            key={index}
            index={index}
            data={house}
            updateHouse={(updates) => updateHouse(index, updates)}
            fixStake={() => fixStake(index)}
          />
        ))}
      </div>

      {/* Results Section */}
      <div className="bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
        <h2 className="text-cyan-400 text-lg mb-4 font-bold uppercase tracking-wider text-center">Resultados</h2>
        
        <div className="bg-gray-800/50 rounded-lg overflow-x-auto border border-cyan-500/30 shadow-inner">
          <div className={cn(
            "grid text-cyan-100 p-3 border-b border-cyan-500/20 font-bold text-xs whitespace-nowrap min-w-max uppercase tracking-wider",
            houses.slice(0, numHouses).some(house => house.lay) 
              ? "grid-cols-5 gap-3" 
              : "grid-cols-4 gap-3"
          )}>
            <div className="min-w-16 text-center">CASA</div>
            <div className="min-w-16 text-center">ODD</div>
            <div className="min-w-20 text-center">STAKE</div>
            {houses.slice(0, numHouses).some(house => house.lay) && (
              <div className="min-w-24 text-center">RESP.</div>
            )}
            <div className="min-w-20 text-center">LUCRO</div>
          </div>
          
          {houses.slice(0, numHouses).map((house, index) => (
            <div key={index} className={cn(
              "grid p-3 border-b border-cyan-500/10 text-xs whitespace-nowrap min-w-max hover:bg-cyan-500/5 transition-colors duration-200",
              houses.slice(0, numHouses).some(house => house.lay) 
                ? "grid-cols-5 gap-3" 
                : "grid-cols-4 gap-3"
            )}>
              <div className="text-cyan-200 min-w-16 text-center font-medium">Casa {index + 1}</div>
              <div className="text-cyan-100 min-w-16 text-center font-mono">
                {house.freebet ? parseFloat(house.odd || 0).toFixed(2) : house.finalOdd.toFixed(2)}
              </div>
              <div className="text-cyan-100 min-w-20 text-center font-mono flex items-center justify-center gap-1">
                R$ {parseFloat(house.stake || "0").toFixed(2)}
                {house.freebet && <span className="text-yellow-400 text-xs">(Freebet)</span>}
              </div>
              {houses.slice(0, numHouses).some(house => house.lay) && (
                <div className="text-cyan-100 min-w-24 text-center font-mono">
                  {house.lay ? `R$ ${parseFloat(house.responsibility || "0").toFixed(2)}` : "-"}
                </div>
              )}
              <div className={cn(
                "min-w-20 text-center font-mono font-bold",
                results.profits[index] >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {results.profits[index] >= 0 ? "R$ " : "-R$ "}
                {Math.abs(results.profits[index] || 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  return (
    <main className="min-h-screen p-4 md:p-8" style={{
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 100%)',
    }}>
      <div className="max-w-6xl mx-auto">
        <Calculator />
      </div>
    </main>
  );
}