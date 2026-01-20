function SphereVecField(radius, maxPhi, maxTheta, inc){

    var totalPoints;
    var pointList;
    var counter = 0;

    pointList = []

    for (let phi = 0; phi < maxPhi; phi += inc )
    {
        for (let theta = 0; theta < maxTheta; theta += inc)
        {
            let x = radius * Math.sin(phi) * Math.cos(theta);
            let y = radius * Math.sin(phi) * Math.sin (theta);
            let z = radius * Math.cos(phi);
            let mag = Math.sqrt( x*x + y*y + z*z);
            let ang = Math.acos(y/mag);
            //ang_deg = 180 * ang / F_PI;
            let point = {
                i: x,
                j: y,
                k: z,
                rotation_ang: ang
            }
            
            pointList.push(point);
            counter += 1;
        }
    }
    return pointList;
}

  