import { useState, useRef, useEffect } from 'react'

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Unstable_Grid2';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';

import bxMap from "./assets/bx.png";
import jyMap from "./assets/jy.png";
import alMap from "./assets/al.png";
import jingwaiMap from "./assets/jingwai.png";
import jnywMap from "./assets/jnyw.png";
import nvercunMap from "./assets/nvercun.png";

interface Point {
  x: number;
  y: number;
}

interface Map {
  name: string;
  src: any;
  xMax: number;
  yMax: number;
  scale: number;
}

const MAPS: Map[] = [
  {
    name: '宝象国',
    src: bxMap,
    xMax: 159,
    yMax: 119,
    scale: 1,
  },
  {
    name: "建邺城",
    src: jyMap,
    xMax: 287,
    yMax: 142,
    scale: 1,
  },
  {
    name: "傲来国",
    src: alMap,
    xMax: 222,
    yMax: 150,
    scale: 1,
  },
  {
    name: "大唐境外",
    src: jingwaiMap,
    xMax: 638,
    yMax: 118,
    scale: 1,
  },
  {
    name: "江南野外",
    src: jnywMap,
    xMax: 159,
    yMax: 119,
    scale: 1,
  },
  {
    name: "女儿村",
    src: nvercunMap,
    xMax: 127,
    yMax: 143,
    scale: 1,
  },
];

function App() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [selectedMap, setSelectedMap] = useState<Map>(MAPS[0]);
  const mapOptions = MAPS.map(map => map.name);

  return (
    <Box sx={{marginLeft: 5}}>
      <Box sx={{ margin: 10, display: 'flex', flexDirection: 'row', height: 500 }}>
        <Box sx={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <TextField
              type="number"
              label="横坐标"
              variant="outlined"
              value={x}
              onChange={change => setX(parseInt(change.target.value))}
            />
            <TextField
              type="number"
              label="纵坐标"
              variant="outlined"
              value={y}
              onChange={change => setY(parseInt(change.target.value))}
              sx={{ marginLeft: 2 }}
            />
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">地图</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                value={selectedMap.name}
                onChange={change => {
                  const selected = MAPS.find(item => item.name === change.target.value);
                  setSelectedMap(selected!);
                }}
              >
                {mapOptions.map(option => (
                  <FormControlLabel value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {selectedMap && (
            <ImageWithOverlay
              x={x}
              y={y}
              map={selectedMap}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

const ImageWithOverlay = ({
  x,
  y,
  map,
}: {
  x: number,
  y: number
  map: Map,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = new Image();
    const {xMax, yMax, scale} = map;

    image.src = map.src;
    image.onload = () => {
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;

      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      console.log('scaledWidth', scaledWidth, 'scaledHeight', scaledHeight);

      context.drawImage(image, 0, 0, scaledWidth, scaledHeight);

      context.strokeStyle = 'red'; // 不透明红色
      context.lineWidth = 5; // 设置边框宽度

      const topLeft = getTopLeft({x, y, yMax});
      const bottomRight = getBottomRight({x, y, xMax});

      const rectX = topLeft.x / xMax * scaledWidth;
      const rectY = (yMax - topLeft.y) / yMax * scaledHeight;
      const rectWidth = (bottomRight.x - topLeft.x) / xMax * scaledWidth;
      const rectHeight = (topLeft.y - bottomRight.y) / yMax * scaledHeight;
      context.strokeRect(rectX, rectY, rectWidth, rectHeight);
    };
  }, [x, y, map]);

  return <canvas ref={canvasRef} />;
};


const getTopLeft = ({
  x,
  y,
  yMax,
}: {
  x: number,
  y: number,
  yMax: number,
}): Point => {
  const pointX = Math.max(x - 50, 0);
  const pointY = Math.min(y + 50, yMax);
  return {
    x: pointX,
    y: pointY,
  };
}

const getBottomRight = ({
  x,
  y,
  xMax,
}: {
  x: number,
  y: number,
  xMax: number,
}): Point => {
  const pointX = Math.min(x + 50, xMax);
  const pointY = Math.max(y - 50, 0);
  return {
    x: pointX,
    y: pointY,
  };
}


export default App
