let pi=3.1416;

// x^y x multyplied y times 
function pow(x,y){
	let power=x;
	let i;
	
	for(i=0;i<(y-1);i++)
		{
			power=power*x;
		}
	
	return power;	
};

// takes a number between (-1 to 1) and returns angle value in degrees (-90 to 90)
function arcsindeg(x){
	let angle;
	
	// infinite series!
	angle = x;
	angle = angle + (1/2) * ( pow(x,3) / 3 );
	angle = angle + ((1*3)/(2*4)) * ( pow(x,5) / 5 );
	angle = angle + ((1*3*5)/(2*4*6)) * ( pow(x,7) / 7 );
	angle = angle + ((1*3*5*7)/(2*4*6*8)) * ( pow(x,9) / 9 );
	angle = angle + ((1*3*5*7*9)/(2*4*6*8*10)) * ( pow(x,11) / 11 );
	
	// convert from radians to degrees	
	angle = (angle*180) / pi;
	return angle;	
};

// takes a number between (-1 to 1) and returns angle value 
function arctan(x){
	let angle;
	
	// infinite series!
	angle = x;
	angle = angle + (1/2) * ( pow(x,3) / 3 );
	angle = angle + ((1*3)/(2*4)) * ( pow(x,5) / 5 );
	angle = angle + ((1*3*5)/(2*4*6)) * ( pow(x,7) / 7 );
	angle = angle + ((1*3*5*7)/(2*4*6*8)) * ( pow(x,9) / 9 );
	angle = angle + ((1*3*5*7*9)/(2*4*6*8*10)) * ( pow(x,11) / 11 );
	
	// convert from radians to degrees	
	angle = (angle*180) / pi;
	return angle;	
};

