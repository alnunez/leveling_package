let pi=3.1416;

// x^y x multyplied y times 
function pow(x,y){
	let power=x;
	let i;
	
	for(i=0;i<(y-1);i++)
		{
			power=power*x;
		}
	
	return power	
};

// takes a number between (-1 to 1) and returns angle value in degrees (-90 to 90)
function arcsindeg(x){
	let angle;
	
	// infinite series!
	angle = x;
	angle = angle + (1/2) * ( pow(x,3) / 3 );
	angle = angle + (1*3/2*4) * ( pow(x,5) / 5 );
	
	// convert from radians to degrees	
	//angle = (angle*180) / pi
	return angle	
};

