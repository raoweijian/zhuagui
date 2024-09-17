import { useState, useEffect } from 'react'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


interface PetProps {
  level: number;

  constitution: number;
  mana: number;
  strength: number;
  stamina: number;
  agility: number;

  healthAptitude: number;
  magicAptitude: number;
  attackAptitude: number;
  defenseAptitude: number;
  speedAptitude: number;
  unallocatedPoints: number;

  growthRate: number;
  spirituality: number;
}

interface PetResult {
  health: number;
  magic: number;
  attack: number;
  defense: number;
  speed: number;
  spiritualPower: number;
}

export default function PetEmulator() {
  const defaultPet: PetProps = {
    level: 0,
    constitution: 0,
    mana: 0,
    strength: 0,
    stamina: 0,
    agility: 0,

    healthAptitude: 0,
    magicAptitude: 0,
    attackAptitude: 0,
    defenseAptitude: 0,
    speedAptitude: 0,
    unallocatedPoints: 0,

    growthRate: 0,
    spirituality: 0,
  };

  const [petProps, setPetProps] = useState<PetProps>(defaultPet);
  const [petResult, setPetResult] = useState<PetResult | null>(null);

  const [comparedPetProps, setComparedPetProps] = useState<PetProps>(defaultPet);
  const [comparedPetResult, setComparedPetResult] = useState<PetResult | null>(null);

  useEffect(() => {
    setPetResult(CalculatePet(petProps));
  }, [petProps]);

  useEffect(() => {
    setComparedPetResult(CalculatePet(comparedPetProps));
  }, [comparedPetProps]);

  const updatePetProps = (key: keyof PetProps, value: number) => {
    const newPetProps = { ...petProps, [key]: value };

    const totalPoints = newPetProps.level * 10 + 100 + newPetProps.spirituality * 2;
    const unallocatedPoints = totalPoints - (
      newPetProps.constitution + newPetProps.mana + newPetProps.strength + newPetProps.stamina + newPetProps.agility
    );
    setPetProps({
      ...newPetProps,
      unallocatedPoints,
    });
  };

  const updateComparedPetProps = (key: keyof PetProps, value: number) => {
    const newPetProps = { ...comparedPetProps, [key]: value };

    const totalPoints = newPetProps.level * 10 + 100 + newPetProps.spirituality * 2;
    const unallocatedPoints = totalPoints - (
      newPetProps.constitution + newPetProps.mana + newPetProps.strength + newPetProps.stamina + newPetProps.agility
    );
    setComparedPetProps({
      ...newPetProps,
      unallocatedPoints,
    });
  }

  const renderPetPropInput = (key: keyof PetProps, label: string) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: "center"}}>
        <InputLabel sx={{color: "black", minWidth: 80, textAlign: "end"}}>{label}</InputLabel>
        <TextField
          type="number"
          size="small"
          variant="outlined"
          color="primary"
          value={petProps[key]}
          onChange={change => updatePetProps(key, parseFloat(change.target.value))}
          sx={{ width: 100 }}
        />
      </Box>
    );
  };

  const renderPetResult = (key: keyof PetResult, label: string) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: "center"}}>
        <InputLabel sx={{color: "black", minWidth: 80, textAlign: "end"}}>{label}</InputLabel>
        <TextField
          type="number"
          size="small"
          variant="outlined"
          value={petResult?.[key]}
          sx={{ width: 130 }}
          disabled
        />
      </Box>
    );
  };

  const renderComparedPetPropInput = (key: keyof PetProps, label: string) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: "center"}}>
        <InputLabel sx={{color: "black", minWidth: 80, textAlign: "end"}}>{label}</InputLabel>
        <TextField
          type="number"
          size="small"
          variant="outlined"
          error={comparedPetProps[key] !== petProps[key]}
          value={comparedPetProps[key]}
          onChange={change => updateComparedPetProps(key, parseFloat(change.target.value))}
          sx={{
            width: 100,
          }}
        />
      </Box>
    );
  }

  const renderComparedPetResult = (key: keyof PetResult, label: string) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: "center"}}>
        <InputLabel sx={{color: "black", minWidth: 80, textAlign: "end"}}>{label}</InputLabel>
        <TextField
          type="number"
          size="small"
          variant="outlined"
          value={comparedPetResult?.[key]}
          error={comparedPetResult?.[key] !== petResult?.[key]}
          sx={{
            width: 130,
            border: comparedPetResult?.[key] !== petResult?.[key] ? "1px solid red" : "0px",
            borderRadius: 2,
          }}
          disabled
        />
      </Box>
    );
  }

  return (
    <div>
      <h1>召唤兽模拟器</h1>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: "center"}}>
        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 5}}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 5}}>
              {renderPetPropInput('level', '等级')}
              {renderPetPropInput('growthRate', '成长')}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 5}}>
              {/* 资质 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3}}>
                {renderPetPropInput('attackAptitude', '攻击资质')}
                {renderPetPropInput('defenseAptitude', '防御资质')}
                {renderPetPropInput('healthAptitude', '体力资质')}
                {renderPetPropInput('magicAptitude', '法力资质')}
                {renderPetPropInput('speedAptitude', '速度资质')}
                {renderPetPropInput('spirituality', '灵性')}
              </Box>

              {/* 属性 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3}}>
                {renderPetPropInput('constitution', '体质')}
                {renderPetPropInput('mana', '法力')}
                {renderPetPropInput('strength', '力量')}
                {renderPetPropInput('stamina', '耐力')}
                {renderPetPropInput('agility', '敏捷')}

                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: "center"}}>
                  <InputLabel sx={{color: "black", minWidth: 80, textAlign: "end"}}>未分配属性点</InputLabel>
                  <p>{petProps.unallocatedPoints}</p>
                </Box>
              </Box>

              {/* 结果 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3}}>
                {renderPetResult('health', '气血')}
                {renderPetResult('magic', '魔法')}
                {renderPetResult('attack', '攻击')}
                {renderPetResult('defense', '防御')}
                {renderPetResult('speed', '速度')}
                {renderPetResult('spiritualPower', '灵力')}
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Button
          variant='contained'
          sx={{maxHeight: 40, minWidth: 100}}
          onClick={() => {
            setComparedPetProps(petProps);
          }}
        >
          {"复制 ↓"}
        </Button>

        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 5}}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 5}}>
              {renderComparedPetPropInput('level', '等级')}
              {renderComparedPetPropInput('growthRate', '成长')}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 5}}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3}}>
                {renderComparedPetPropInput('attackAptitude', '攻击资质')}
                {renderComparedPetPropInput('defenseAptitude', '防御资质')}
                {renderComparedPetPropInput('healthAptitude', '体力资质')}
                {renderComparedPetPropInput('magicAptitude', '法力资质')}
                {renderComparedPetPropInput('speedAptitude', '速度资质')}
                {renderComparedPetPropInput('spirituality', '灵性')}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3}}>
                {renderComparedPetPropInput('constitution', '体质')}
                {renderComparedPetPropInput('mana', '法力')}
                {renderComparedPetPropInput('strength', '力量')}
                {renderComparedPetPropInput('stamina', '耐力')}
                {renderComparedPetPropInput('agility', '敏捷')}

                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: "center"}}>
                  <InputLabel sx={{color: "black", minWidth: 80, textAlign: "end"}}>未分配属性点</InputLabel>
                  <p>{comparedPetProps.unallocatedPoints}</p>
                </Box>

              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3}}>
                {renderComparedPetResult('health', '气血')}
                {renderComparedPetResult('magic', '魔法')}
                {renderComparedPetResult('attack', '攻击')}
                {renderComparedPetResult('defense', '防御')}
                {renderComparedPetResult('speed', '速度')}
                {renderComparedPetResult('spiritualPower', '灵力')}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  )
}

const CalculatePet = (petProps: PetProps): PetResult => {
  const attack = Math.floor(petProps.level * petProps.attackAptitude * (14 + 10 * petProps.growthRate) / 7500) +
    Math.floor(petProps.strength * petProps.growthRate * 0.75) +
    Math.floor(petProps.strength * petProps.growthRate * 0.25);
  const defense = Math.floor(petProps.level * petProps.defenseAptitude * (9.4 + 19/3 * petProps.growthRate) / 7500) +
    Math.floor(petProps.stamina * petProps.growthRate * 4 / 3);
  const speed = Math.floor(petProps.agility * petProps.speedAptitude / 1000);
  const health = Math.floor(petProps.level * petProps.healthAptitude / 1000) +
    Math.floor(petProps.constitution * petProps.growthRate * 6);

  return {
    health,
    magic: 0,
    attack,
    defense,
    speed,
    spiritualPower: 0,
  }
}
