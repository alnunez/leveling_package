load('api_sys.js');
load('api_i2c.js');
load('api_timer.js');
load('api_pwm.js');
load('api_gpio.js');
load('api_rpc.js');
load('api_neopixel.js');

load('mpu60x0_h.js');
load('math.js');


print('***********************');
print('Gravity by BeSense 2021');
print('***********************');

let accelreadperiod=100;
let debugprintperiod=1000;
let ledblinkperiod=500;
let ComfortAngle = 3.0;
let i2chandler=I2C.get();

let ax;
let ay;
let aux;
let auy;

let angulox;
let anguloy;

let angy;

let buttonPin=33;
let ledPin=23;

let pixelPin=18;
let pixelNum=11;
let pixelColorOrder = NeoPixel.GRB;

GPIO.set_mode(ledPin, GPIO.MODE_OUTPUT);
GPIO.set_pull(ledPin, GPIO.PULL_NONE)

GPIO.set_mode(buttonPin, GPIO.MODE_INPUT);
GPIO.set_pull(buttonPin, GPIO.PULL_NONE)

GPIO.set_button_handler(buttonPin, GPIO.PULL_NONE, GPIO.INT_EDGE_POS, 50,
function() {
  print('Function button pressed!');
}, null);

let pixelstrip = NeoPixel.create(pixelPin, pixelNum, pixelColorOrder);
pixelstrip.clear();
pixelstrip.show();

print('Detectinc I2C MPU60X0...');
let i2cdata=I2C.readRegB(i2chandler, MGOS_MPU60X0_DEFAULT_I2CADDR, MGOS_MPU60X0_REG_WHO_AM_I);

if (i2cdata >= 0)
	{ 
		print('MPU60x0 Detected at address ',MGOS_MPU60X0_DEFAULT_I2CADDR); 
	} 	
else
	{
		print('Error detecting MPU60x0 at address',MGOS_MPU60X0_DEFAULT_I2CADDR);	
	}
	

print('Reset IMU');
let i2cdata=I2C.writeRegB(i2chandler,MGOS_MPU60X0_DEFAULT_I2CADDR,MGOS_MPU60X0_REG_PWR_MGMT_1, 0x80);
Sys.usleep(80000);

print('Enable IMU sensors');
let i2cdata=I2C.writeRegB(i2chandler,MGOS_MPU60X0_DEFAULT_I2CADDR,MGOS_MPU60X0_REG_PWR_MGMT_2, 0x00);

print('Set DPLF');
 // Set DPLF: -- EXT_SYNC_SET=000 DLPF_CFG=010 (94Hz accel, 98Hz gyro, Fs=1KHz)
let i2cdata=I2C.writeRegB(i2chandler, MGOS_MPU60X0_DEFAULT_I2CADDR, MGOS_MPU60X0_REG_CONFIG, 0x02);

print('IMU Exit sleep mode');
let i2cdata=I2C.writeRegB(i2chandler, MGOS_MPU60X0_DEFAULT_I2CADDR, MGOS_MPU60X0_REG_PWR_MGMT_1, 0x00);

print('IMU Accel config');
// Accel Config: XA_ST=0 YG_AT=0 ZA_ST=0 FS_SEL=00 (2G) ---
let i2cdata=I2C.writeRegB(i2chandler, MGOS_MPU60X0_DEFAULT_I2CADDR, MGOS_MPU60X0_REG_ACCEL_CONFIG, 0x00);

print('Reading accel data every',accelreadperiod);

print('Testing led ON');
GPIO.setup_output(ledPin, 1)

Timer.set(500, 0, function() {
  print('Testing led OFF');
  GPIO.setup_output(ledPin, 0)
}, null);

// Get data from IMU
Timer.set(accelreadperiod, Timer.REPEAT, function() {
  let imudata=I2C.readRegN(i2chandler, MGOS_MPU60X0_DEFAULT_I2CADDR, MGOS_MPU60X0_REG_ACCEL_XOUT_H, 6);
  ax = (imudata.at(0) << 8) | (imudata.at(1));
  ay = (imudata.at(2) << 8) | (imudata.at(3));
  
  // Two's complement
  if ( ax > 32767 )
  	{
  		ax = ax - 65535;
  	}  
  if ( ay > 32767 )
  	{
  		ay = ay - 65535;
  	}  	  
  // values are now in range -32768 to 32767 (-2G to 2G) !
  
  // scaling to unitary circle values
  aux = (ax/16383);	
  auy = (ay/16383);	

  // compute arcsin() to get inclination angle
  
  angy=arcsindeg(auy);
  
  angulox = (ax/16383)*90.0;	
  anguloy = (ay/16383)*90.0;	


  // Led logic for X axis
  
  if (angulox > (-1* ComfortAngle) && angulox < ComfortAngle)
  {  	
    pixelstrip.setPixel(4, 255, 0, 0);
    pixelstrip.setPixel(8, 255, 0, 0);
    pixelstrip.show();
  }  
  
  if (angulox > ComfortAngle)
  {  	
    pixelstrip.setPixel(4, 0, 255, 0);
    pixelstrip.setPixel(8, 0, 0, 255);
    pixelstrip.show();
  }  
  
  if (angulox < (-1* ComfortAngle) )
  {
    pixelstrip.setPixel(4, 0, 0, 255);
    pixelstrip.setPixel(8, 0, 225, 0);
    pixelstrip.show();
  }  

// Led logic for Y axis
  
  if (anguloy > (-1* ComfortAngle) && anguloy < ComfortAngle)
  {
  	pixelstrip.setPixel(6, 255, 0, 0);
    pixelstrip.setPixel(10, 255, 0, 0);
    pixelstrip.show();
  }  
  
  if (anguloy > ComfortAngle)
  {
  	pixelstrip.setPixel(6, 0, 255, 0);
    pixelstrip.setPixel(10, 0, 0, 255);
    pixelstrip.show();
  }  
  
  if (anguloy < (-1* ComfortAngle) )
  {
    pixelstrip.setPixel(6, 0, 0, 255);
    pixelstrip.setPixel(10, 0, 225, 0);
    pixelstrip.show();
  }  
  
}, null);

// Print some data for debug
Timer.set(debugprintperiod, Timer.REPEAT, function() {

  print('Printing accelerometer data:');
  print('angulox',angulox);
  print('anguloy',anguloy);
  print('auy',auy);
  print('arcsin',angy);
  
}, null);


RPC.addHandler('Sum', function(args) {
  if (typeof(args) === 'object' && typeof(args.a) === 'number' &&
      typeof(args.b) === 'number') {
    return args.a + args.b;
  } else {
    return {error: -1, message: 'Bad request. Expected: {"a":N1,"b":N2}'};
  }
});
