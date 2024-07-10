/*   Author: Emily Crow
 *   Exercise recreating the clocks from https://www.time.cwandt.com/00.php
 */

// Clock enum
const ClockStates = Object.freeze({
    BEZIER: Symbol("bezier")
})

// Point object
class Point {
    constructor(x, y) {
        this.x = x,
        this.y = y
    }
}

// Global variables
const canvas = document.getElementById("clockFace")
const clockCtx = canvas.getContext("2d")
const height = canvas.height
const width = canvas.width
const centerPoint = new Point(width / 2, height / 2)
const bScale = 1.08
clockCtx.strokeStyle = "white"
clockCtx.fillStyle = "grey"




function drawBezierClock(date) {
    const seconds = date.getSeconds()
    const millis = date.getMilliseconds()
    const minutes = date.getMinutes()
    const hours = date.getHours() % 12
    const radius = width/2
    const secondsRadius = radius - 60
    const minutesRadius = radius - 90
    const hoursRadius = radius - 150


    //Get endpoints
    secondsPoint = getPointOnCircle((seconds + normalize(millis, 0, 1000)) / 60, secondsRadius)
    minutesPoint = getPointOnCircle((minutes + normalize(seconds, 0, 60)) / 60, minutesRadius)
    hoursPoint = getPointOnCircle((hours + normalize(minutes, 0, 60)) / 12, hoursRadius)

    //Set control points
    const secondsControlPoint = getPointOnCircle((seconds + normalize(millis, 0, 1000)) / 60, radius * bScale)
    const minutesControlPoint = getPointOnCircle((minutes + normalize(seconds, 0, 60)) / 60, radius * bScale)
    const hoursControlPoint = getPointOnCircle((hours + normalize(minutes, 0, 60)) / 12, radius * bScale)

    clearClockFace()

    //Draw clock background
    clockCtx.beginPath();
    clockCtx.arc(centerPoint.x,centerPoint.y,width/2,0,2*Math.PI)
    clockCtx.fill();
    clockCtx.closePath();

    //Draw clock hands
    drawHand(secondsPoint)
    drawHand(minutesPoint)
    drawHand(hoursPoint)    

    //Draw bezier curves
    drawBezier(secondsPoint, minutesPoint, secondsControlPoint, minutesControlPoint)
    drawBezier(minutesPoint, hoursPoint, minutesControlPoint, hoursControlPoint)
    drawBezier(hoursPoint, secondsPoint, hoursControlPoint, secondsControlPoint)
}

function clearClockFace() { clockCtx.clearRect(0,0,width,height) }

function getPointOnCircle(percent, radius) { 
    let x = centerPoint.x + (Math.sin(2*Math.PI*percent) * radius)
    let y = centerPoint.y - (Math.cos(2*Math.PI*percent) * radius)
    return new Point(x, y)
}

function drawHand(endPoint) {
    clockCtx.beginPath()
    clockCtx.moveTo(centerPoint.x, centerPoint.y)
    clockCtx.lineTo(endPoint.x, endPoint.y)
    clockCtx.stroke()
    clockCtx.closePath()
}

function drawBezier(startPoint, endPoint, cPoint1, cPoint2) {
    clockCtx.moveTo(startPoint.x,startPoint.y)
    clockCtx.bezierCurveTo(cPoint1.x, cPoint1.y,
        cPoint2.x, cPoint2.y,
        endPoint.x, endPoint.y)
    clockCtx.stroke()
}

function normalize(val,min,max) { return Math.max(0, Math.min(1, (val-min) / (max-min))) }

let inst = new Date()
console.log(inst)

function animate() {
    requestAnimationFrame(animate)
    drawBezierClock(new Date())
}
animate()