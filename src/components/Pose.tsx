
import * as React from 'react';

declare var ml5: any;

export interface IPoseProps {
}

export interface IPoseState {
    detected?: boolean
}

export default class Pose extends React.Component<IPoseProps, IPoseState> {
    private webCam: React.RefObject<HTMLVideoElement>;
    private camCanvas: React.RefObject<HTMLCanvasElement>;
    private poseNet: any;
    private HEIGHT: number;
    private WIDTH: number;
    private ctx: CanvasRenderingContext2D;
    private poses: any;
    private modelLoaded: boolean;

    constructor(props: IPoseProps) {
        super(props);
        this.webCam = React.createRef();
        this.camCanvas = React.createRef();
        this.HEIGHT = 400;
        this.WIDTH = 600;
        this.modelLoaded = false;
        this.state = {
            detected: false
        };
    }

    initializeModel() {
        this.poseNet = ml5.poseNet(this.webCam.current, () => {
            console.log("Model Initilaized");
            this.modelLoaded = true;
            this.poseNet.on('pose', (result: any) => {
                this.poses = result;
                this.setState({
                    detected: result !== undefined && result.length > 0 ? true : false
                })
            });
        });
    }

    drawKeypoints() {
        for (let i = 0; i < this.poses.length; i++) {
            for (let j = 0; j < this.poses[i].pose.keypoints.length; j++) {
                let keypoint = this.poses[i].pose.keypoints[j];
                if (keypoint.score > 0.2) {
                    this.ctx.fillStyle = "#c82124";
                    this.ctx.beginPath();
                    this.ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
            }
        }
    }

    drawSkeleton() {
        for (let i = 0; i < this.poses.length; i++) {
            for (let j = 0; j < this.poses[i].skeleton.length; j++) {
                let partA = this.poses[i].skeleton[j][0];
                let partB = this.poses[i].skeleton[j][1];
                this.ctx.beginPath();
                this.ctx.moveTo(partA.position.x, partA.position.y);
                this.ctx.lineTo(partB.position.x, partB.position.y);
                this.ctx.stroke();
            }
        }
    }

    drawCameraIntoCanvas() {
        if (this.modelLoaded) {
            this.ctx.drawImage(this.webCam.current, 0, 0, this.WIDTH, this.HEIGHT)
        }
        if (this.poses !== undefined) {
            this.drawKeypoints();
            this.drawSkeleton();
        }
        requestAnimationFrame(this.drawCameraIntoCanvas.bind(this));
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
                    frameRate: 15, // Reduce this if there's a stuttering in feed
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
                {this.state.detected ? "Found You!!!" : "Show yourself"}
            </div>
        );
    }
}
