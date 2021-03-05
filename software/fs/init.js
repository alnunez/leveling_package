load('api_sys.js');
load('api_i2c.js');
load('api_timer.js');
load('api_pwm.js');
load('api_gpio.js');
load('api_neopixel.js');
load('mpu60x0_h.js');


print('***********************');
print('Gravity by BeSense 2021');
print('***********************');

let accelreadperiod=100;
let ledblinkperiod=500;
let ComfortAngle = 3.0;
let i2chandler=I2C.get();

let ax;
let ay;
let angulox;
let anguloy;
let dutym4;
let ledM1 = 32;
let ledM2 = 33;
let ledM3 = 25;
let ledM4 = 26;

let pixelPin=18;
let pixelNum=3;
let pixelColorOrder = NeoPixel.GRB;

GPIO.set_mode(ledM4, GPIO.MODE_OUTPUT);
GPIO.set_pull(ledM4, GPIO.PULL_NONE)
GPIO.set_mode(ledM3, GPIO.MODE_OUTPUT);
GPIO.set_pull(ledM3, GPIO.PULL_NONE)
GPIO.set_mode(ledM2, GPIO.MODE_OUTPUT);
GPIO.set_pull(ledM2, GPIO.PULL_NONE)
GPIO.set_mode(ledM1, GPIO.MODE_OUTPUT);
GPIO.set_pull(ledM1, GPIO.PULL_NONE)


let pixelstrip = NeoPixel.create(pixelPin, pixelNum, pixelColorOrder);

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


// Get data from IMU
Timer.set(accelreadperiod, Timer.REPEAT, function() {
  let imudata=I2C.readRegN(i2chandler, MGOS_MPU60X0_DEFAULT_I2CADDR, MGOS_MPU60X0_REG_ACCEL_XOUT_H, 6);
  ax = (imudata.at(0) << 8) | (imudata.at(1));
  ay = (imudata.at(2) << 8) | (imudata.at(3));
  if ( ax > 32767 )
  	{
  		ax = ax - 65535;
  	}  
  if ( ay > 32767 )
  	{
  		ay = ay - 65535;
  	}  	
  
  angulox = (ax/16383)*90.0;	
  anguloy = (ay/16383)*90.0;	


  // Led logic for X axis
  
  if (angulox > (-1* ComfortAngle) && angulox < ComfortAngle)
  {
  	GPIO.blink(ledM4, 0, 0)
  	GPIO.blink(ledM3, 0, 0)
  	GPIO.write(ledM4, 1);
  	GPIO.write(ledM3, 1);
  	
  	pixelstrip.clear();
    pixelstrip.setPixel(1, 255, 0, 0);
    pixelstrip.setPixel(2, 255, 0, 0);
    pixelstrip.show();

  }  
  
  if (angulox > ComfortAngle)
  {
  	GPIO.blink(ledM4, ledblinkperiod, ledblinkperiod)
  	GPIO.blink(ledM3, 0, 0);
  	GPIO.write(ledM3, 0);
  	pixelstrip.clear();
    pixelstrip.setPixel(1, 0, 255, 0);
    pixelstrip.setPixel(2, 0, 0, 255);
    pixelstrip.show();
  }  
  
  if (angulox < (-1* ComfortAngle) )
  {
  	GPIO.blink(ledM3, ledblinkperiod, ledblinkperiod)
  	GPIO.blink(ledM4, 0, 0);
  	GPIO.write(ledM4, 0);
  	pixelstrip.clear();
    pixelstrip.setPixel(1, 0, 0, 255);
    pixelstrip.setPixel(2, 0, 225, 0);
    pixelstrip.show();
  }  

// Led logic for Y axis
  
  if (anguloy > (-1* ComfortAngle) && anguloy < ComfortAngle)
  {
  	GPIO.blink(ledM2, 0, 0)
  	GPIO.blink(ledM1, 0, 0)
  	GPIO.write(ledM2, 1);
  	GPIO.write(ledM1, 1);
  }  
  
  if (anguloy > ComfortAngle)
  {
  	GPIO.blink(ledM1, ledblinkperiod, ledblinkperiod)
  	GPIO.blink(ledM2, 0, 0);
  	GPIO.write(ledM2, 0);
  }  
  
  if (anguloy < (-1* ComfortAngle) )
  {
  	GPIO.blink(ledM2, ledblinkperiod, ledblinkperiod)
  	GPIO.blink(ledM1, 0, 0);
  	GPIO.write(ledM1, 0);
  }  
  
}, null);

// Print some data for debug
Timer.set(1000, Timer.REPEAT, function() {

  print('Reading accelerometer');
  //print('ax',ax);
  //print('ay',ay);
  print('angulox',angulox);
  print('anguloy',anguloy);
  //print('duty M4',dutym4);
  
}, null);

//pixelstrip.clear();
//pixelstrip.setPixel(1, 12, 34, 56);
//pixelstrip.setPixel(2, 12, 34, 56);
//pixelstrip.setPixel(3, 12, 34, 56);
//pixelstrip.show();
