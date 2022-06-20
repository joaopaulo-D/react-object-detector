import React, { useState, useRef } from "react";

import "@tensorflow/tfjs-backend-cpu";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

import {
  DetectorContainer,
  HiddenFileInput,
  InformaitionContainer,
  ObjectsDetectContainer,
  SelectButton,
  TargetBox,
  TargetImg
} from "./styles";

export default function ObjectsDetect() {
  const fileInputRef = useRef<any>();
  const imageRef = useRef<any>();
  const [imgData, setImgData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const isEmptyPredictions = !predictions || predictions.length === 0;

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const normalizePredictions = (predictions: any, imgSize: any) => {
    if (!predictions || !imgSize || !imageRef) return predictions || [];
    return predictions.map((prediction: any) => {
      const { bbox } = prediction;
      const oldX = bbox[0];
      const oldY = bbox[1];
      const oldWidth = bbox[2];
      const oldHeight = bbox[3];

      const imgWidth = imageRef.current.width;
      const imgHeight = imageRef.current.height;

      const x = (oldX * imgWidth) / imgSize.width;
      const y = (oldY * imgHeight) / imgSize.height;
      const width = (oldWidth * imgWidth) / imgSize.width;
      const height = (oldHeight * imgHeight) / imgSize.height;

      return { ...prediction, bbox: [x, y, width, height] };
    });
  };

  const detectObjectsOnImage = async (imageElement: any, imgSize: any) => {
    const model = await cocoSsd.load({});
    const predictions = await model.detect(imageElement, 6);
    const normalizedPredictions = normalizePredictions(predictions, imgSize);
    setPredictions(normalizedPredictions);
    console.log("Pred: ", predictions);
  };

  const readImage = (file: any) => {
    return new Promise((rs, rj) => {
      const fileReader = new FileReader();
      fileReader.onload = () => rs(fileReader.result);
      fileReader.onerror = () => rj(fileReader.error);
      fileReader.readAsDataURL(file);
    });
  };

  const onSelectImage = async (e: any) => {
    setPredictions([]);
    setLoading(true);

    const file = e.target.files[0];
    const imgData: any = await readImage(file);
    setImgData(imgData);

    const imageElement = document.createElement("img");
    imageElement.src = imgData;

    imageElement.onload = async () => {
      const imgSize = {
        width: imageElement.width,
        height: imageElement.height,
      };
      await detectObjectsOnImage(imageElement, imgSize);
      setLoading(false);
    };
  };

  return (
    <ObjectsDetectContainer>
      <InformaitionContainer>
        <h1>Detector de Objetos</h1>
      </InformaitionContainer>
      <DetectorContainer>
        {imgData && <TargetImg src={imgData} ref={imageRef} />}
        {!isEmptyPredictions &&
          predictions.map((prediction: any, idx) => (
            <TargetBox
              key={idx}
              x={prediction.bbox[0]}
              y={prediction.bbox[1]}
              width={prediction.bbox[2]}
              height={prediction.bbox[3]}
              classType={prediction.class}
              score={prediction.score * 100}
            />
          ))}
      </DetectorContainer>
      <HiddenFileInput
        type="file"
        ref={fileInputRef}
        onChange={onSelectImage}
      />
      <SelectButton onClick={openFilePicker}>
        {isLoading ? "Reconhecendo Aguarde..." : "Selecione uma imagem"}
      </SelectButton>
    </ObjectsDetectContainer>
  );
}
