input.onButtonPressed(Button.A, function () {
    Sleep()
})
function Sleep () {
    for (let index = 0; index <= 10; index++) {
        maqueen.servoRun(maqueen.Servos.S1, (LowerLimit - HeadAngle) / 10 * index + HeadAngle)
        basic.pause(50)
    }
    HeadAngle = LowerLimit
    WakeOn = false
    basic.showIcon(IconNames.SmallHeart)
}
function Wake () {
    for (let index2 = 0; index2 <= 10; index2++) {
        maqueen.servoRun(maqueen.Servos.S1, (WakeAngle - HeadAngle) / 10 * index2 + HeadAngle)
        basic.pause(50)
    }
    HeadAngle = WakeAngle
    WakeOn = true
    basic.showIcon(IconNames.Heart)
}
input.onButtonPressed(Button.B, function () {
    basic.pause(1000)
    Wake()
})
let Width = 0
let CoordinateY = 0
let Height = 0
let CoordinateX = 0
let WakeOn = false
let WakeAngle = 0
let HeadAngle = 0
let LowerLimit = 0
let strip = neopixel.create(DigitalPin.P15, 4, NeoPixelMode.RGB)
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_FACE_RECOGNITION)
LowerLimit = 80
let UpperLimit = 120
HeadAngle = LowerLimit
WakeAngle = (LowerLimit + UpperLimit) * 0.5
let UPAction = "none"
let LRAction = "none"
Sleep()
basic.forever(function () {
    // DFRobotMaqueenPluss.setRGBLight(RGBLight.RGBA, Color.OFF)
    strip.showColor(neopixel.colors(NeoPixelColors.Black))
    if (WakeOn) {
        if (UPAction == "upper") {
            HeadAngle += 2
            if (HeadAngle > UpperLimit) {
                HeadAngle = UpperLimit
            }
            maqueen.servoRun(maqueen.Servos.S1, HeadAngle)
        } else if (UPAction == "lower") {
            HeadAngle += -2
            if (HeadAngle < LowerLimit) {
                HeadAngle = LowerLimit
            }
            maqueen.servoRun(maqueen.Servos.S1, HeadAngle)
        }
        if (LRAction == "left") {
            maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, 40)
            maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 40)
            basic.pause(160 - CoordinateX)
        } else if (LRAction == "right") {
            maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 40)
            maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 40)
            basic.pause(CoordinateX - 160)
        }
        // maqueen.setRGBLight(RGBLight.RGBA, Color.RED)
        // DFRobotMaqueenPluss.setRGBLight(RGBLight.RGBA, Color.YELLOW)
        strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
        if (UPAction == "middle" && LRAction == "center") {
            // setRGBLight(RGBLight.RGBA, maqueen.Color.GREEN)
            strip.showColor(neopixel.colors(NeoPixelColors.Green))
            if (Height < 160) {
                maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 60)
                basic.pause(240 - Height)
            } else {
                maqueen.motorStop(maqueen.Motors.All)
                Sleep()
            }
        } else if (UPAction == "none" && LRAction == "none") {
        	strip.showColor(neopixel.colors(NeoPixelColors.Red))
        } else {
        	strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
        }
        maqueen.motorStop(maqueen.Motors.All)
        basic.pause(240 / Height * 10)
    } else {
    	
    }
})
control.inBackground(function () {
    while (true) {
        huskylens.request()
        if (huskylens.isAppear(1, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
            CoordinateX = huskylens.readeBox(1, Content1.xCenter)
            CoordinateY = huskylens.readeBox(1, Content1.yCenter)
            Width = huskylens.readeBox(1, Content1.width)
            Height = huskylens.readeBox(1, Content1.height)
            if (CoordinateY < 100) {
                UPAction = "upper"
            } else if (CoordinateY > 139) {
                UPAction = "lower"
            } else {
                UPAction = "middle"
            }
            if (CoordinateX < 140) {
                LRAction = "left"
            } else if (CoordinateX > 179) {
                LRAction = "right"
            } else {
                LRAction = "center"
            }
        } else {
            UPAction = "none"
            LRAction = "none"
        }
        basic.pause(10)
    }
})
