import * as React from 'react';

declare var ml5: any;

export interface IFaceProps {
}

export interface IFaceState {
    modelResult?: any
}

export default class Face extends React.Component<IFaceProps, IFaceState> {
    private webCam: React.RefObject<HTMLVideoElement>;
    private camCanvas: React.RefObject<HTMLCanvasElement>;
    private faceNet: any;
    private HEIGHT: number;
    private WIDTH: number;
    private ctx: CanvasRenderingContext2D;
    private modelLoaded: boolean;
    private foundFace: boolean;

    constructor(props: IFaceProps) {
        super(props);
        this.webCam = React.createRef();
        this.camCanvas = React.createRef();
        this.HEIGHT = 400;
        this.WIDTH = 600;
        this.modelLoaded = false;

        this.state = {};

        this.runDetection = this.runDetection.bind(this);
        this.drawCameraIntoCanvas = this.drawCameraIntoCanvas.bind(this);
    }

    initializeModel() {
        let detectionOptions = {
            withLandmarks: true,
            withDescriptors: false,
        };
        this.faceNet = ml5.faceApi(this.webCam.current, detectionOptions, () => {
            console.log("Model Initilaized", this.faceNet);
            this.modelLoaded = true;
        });
    }

    runDetection() {
        this.faceNet.detectSingle((error: any, result: any) => {
            if (error) {
                console.error(error);
            }
            else {
                console.log(result);
                // this.drawBox(result);
            }
            // this.faces = result;
        });
    }

    drawBox(detections: any) {
        this.foundFace = true;
        for (let i = 0; i < detections.length; i += 1) {
            const alignedRect = detections[i].alignedRect;
            const x = alignedRect._box._x;
            const y = alignedRect._box._y;
            const boxWidth = alignedRect._box._width;
            const boxHeight = alignedRect._box._height;

            this.ctx.beginPath();
            this.ctx.rect(x, y, boxWidth, boxHeight);
            this.ctx.strokeStyle = "#a15ffb";
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    drawCameraIntoCanvas() {
        if (this.modelLoaded) {
            this.ctx.drawImage(this.webCam.current, 0, 0, 640, 480);
            this.runDetection();
        }
        requestAnimationFrame(this.drawCameraIntoCanvas);
    }

    componentDidMount() {
        this.ctx = this.camCanvas.current.getContext('2d');
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error(
                'Browser API navigator.mediaDevices.getUserMedia not available');
        }
        navigator.mediaDevices
            .getUserMedia({
                'audio': false,
                'video': {
                    facingMode: 'user',
                    width: this.WIDTH,
                    height: this.HEIGHT,
                    frameRate: 25,
                },
            }).then(res => {
                if (res != null) {
                    this.webCam.current!.srcObject = res;
                    this.webCam.current?.play();

                    this.drawCameraIntoCanvas();
                    this.initializeModel();
                }
            });
    }

    public render() {
        const camStyle: React.CSSProperties = {
            display: 'none'
        }

        return (
            <div className="container">
                <canvas ref={this.camCanvas} width={this.WIDTH} height={this.HEIGHT} />
                <video playsInline ref={this.webCam} width={this.WIDTH} height={this.HEIGHT} style={camStyle} />
                {this.foundFace ? "Drawing Bounding Box" : "Look into Camera!!!"}
            </div>
        );
    }
}
