import { useState, useRef, useEffect } from 'react'

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';

import baoXiangGuoMap from "./assets/宝象国.png";
import jianYeChengMap from "./assets/建邺城.png";
import aoLaiGuoMap from "./assets/傲来国.png";
import daTangJingWaiMap from "./assets/大唐境外.png";
import jiangNanYeWaiMap from "./assets/江南野外.png";
import nvErCunMap from "./assets/女儿村.png";
import wuZhuangGuanMap from "./assets/五庄观.png";
import xiLiangNvGuoMap from "./assets/西凉女国.png";
import changShouCunMap from "./assets/长寿村.png";
import zhuZiGuoMap from "./assets/朱紫国.png";

interface Point {
  x: number;
  y: number;
}

interface Map {
  name: string;
  src: string;
  xMax: number;
  yMax: number;
  scale: number;
  overlayWidth?: number;
}

const MAPS: Map[] = [
  {
    name: '宝象国',
    src: baoXiangGuoMap,
    xMax: 159,
    yMax: 119,
    scale: 1,
  },
  {
    name: "建邺城",
    src: jianYeChengMap,
    xMax: 287,
    yMax: 142,
    scale: 1,
    overlayWidth: 8,
  },
  {
    name: "傲来国",
    src: aoLaiGuoMap,
    xMax: 222,
    yMax: 150,
    scale: 1,
    overlayWidth: 8,
  },
  {
    name: "大唐境外",
    src: daTangJingWaiMap,
    xMax: 638,
    yMax: 118,
    scale: 1,
    overlayWidth: 10,
  },
  {
    name: "江南野外",
    src: jiangNanYeWaiMap,
    xMax: 159,
    yMax: 119,
    scale: 1,
    overlayWidth: 10,
  },
  {
    name: "女儿村",
    src: nvErCunMap,
    xMax: 127,
    yMax: 143,
    scale: 1,
    overlayWidth: 8,
  },
  {
    name: "五庄观",
    src: wuZhuangGuanMap,
    xMax: 99,
    yMax: 74,
    scale: 1,
    overlayWidth: 10,
  },
  {
    name: "西梁女国",
    src: xiLiangNvGuoMap,
    xMax: 163,
    yMax: 123,
    scale: 1,
    overlayWidth: 10,
  },
  {
    name: "长寿村",
    src: changShouCunMap,
    xMax: 159,
    yMax: 209,
    scale: 1,
    overlayWidth: 8,
  },
  {
    name: "朱紫国",
    src: zhuZiGuoMap,
    xMax: 191,
    yMax: 119,
    scale: 1,
    overlayWidth: 10,
  },
];

function App() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [selectedMap, setSelectedMap] = useState<Map>(MAPS[0]);
  const mapOptions = MAPS.map(map => map.name);

  return (
    <Box sx={{ margin: 10, display: 'flex', flexDirection: 'row'}}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: 300}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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

        <Box sx={{ marginTop: 3 }}>
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

      <Box sx={{ flex: 1, display: 'flex', marginLeft: 5, height: 1000}}>
        {selectedMap && (
          <div style={{ width: '100%', maxWidth: '100%', height: "100%", maxHeight: "100%"}}> {/* 使用 div 包裹以控制宽度 */}
            <ImageWithOverlay x={x} y={y} map={selectedMap} />
          </div>
        )}
      </Box>
    </Box>
  )
}

// 组件内部的 canvas 绘制逻辑不变
const ImageWithOverlay = ({
  x,
  y,
  map,
}: {
  x: number;
  y: number;
  map: Map;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = new Image();
    const { xMax, yMax, scale } = map;

    image.src = map.src;
    image.onload = () => {
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;

      // 将 canvas 的实际宽高设置为原始缩放宽高
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      context.drawImage(image, 0, 0, scaledWidth, scaledHeight);

      context.strokeStyle = 'red'; // 不透明红色
      context.lineWidth = map.overlayWidth || 5;

      const topLeft = getTopLeft({ x, y, yMax });
      const bottomRight = getBottomRight({ x, y, xMax });

      const rectX = (topLeft.x / xMax) * scaledWidth;
      const rectY = ((yMax - topLeft.y) / yMax) * scaledHeight;
      const rectWidth = ((bottomRight.x - topLeft.x) / xMax) * scaledWidth;
      const rectHeight = ((topLeft.y - bottomRight.y) / yMax) * scaledHeight;
      context.strokeRect(rectX, rectY, rectWidth, rectHeight);
    };
  }, [x, y, map]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 'auto', display: 'block', maxHeight: "100%"}}
    />
  );
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
