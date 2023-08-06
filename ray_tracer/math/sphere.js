/*
 * An object type representing an implicit sphere.
 *
 * @param center A Vector3 object representing the position of the center of the sphere
 * @param radius A Number representing the radius of the sphere.
 * 
 * Example usage:
 * var mySphere = new Sphere(new Vector3(1, 2, 3), 4.23);
 * var myRay = new Ray(new Vector3(0, 1, -10), new Vector3(0, 1, 0));
 * var result = mySphere.raycast(myRay);
 * 
 * if (result.hit) {
 *   console.log("Got a valid intersection!");
 * }
 */

var Sphere = function(center = new Vector3(0,0,0), radius=1, color= new Vector3(1,1,1)) {
  // Sanity checks (your modification should be below this where indicated)
  if (!(this instanceof Sphere)) {
    console.error("Sphere constructor must be called with the new operator");
  }
 
    this.center = center;
    this.radius = radius;
    this.color = color;

  // todo - make sure this.center and this.radius are replaced with default values if and only if they
  // are invalid or undefined (i.e. center should be of type Vector3 & radius should be a Number)
  // - the default center should be the zero vector
  // - the default radius should be 1
  // YOUR CODE HERE

  // default values plassed arguments to the funciton, that will be overwritten when actual arguments are passed
  
  // Sanity checks (your modification should be above this)
  if (!(this.center instanceof Vector3)) {
    console.error("The sphere center must be a Vector3");
  }

  if ((typeof(this.radius) != 'number')) {
    console.error("The radius must be a Number");
  }
};

Sphere.prototype = {
  
  //----------------------------------------------------------------------------- 
  raycast: function(r1) {
    // todo - determine whether the ray intersects has a VALID intersection with this
	//        sphere and if so, where. A valid intersection is on the is in front of
	//        the ray and whose origin is NOT inside the sphere

    // Recommended steps
    // ------------------
    // 0. (optional) watch the video showing the complete implementation of plane.js
    //    You may find it useful to see a different piece of geometry coded.

    // 1. review slides/book math
    
    // 2. identity the vectors needed to solve for the coefficients in the quadratic equation

    // 3. calculate the discriminant
    
    // 4. use the discriminant to determine if further computation is necessary 
    //    if (discriminant...) { ... } else { ... }

    // 5. return the following object literal "result" based on whether the intersection
    //    is valid (i.e. the intersection is in front of the ray AND the ray is not inside
    //    the sphere)
    //    case 1: no VALID intersections
    //      var result = { hit: false, point: null }
    //    case 2: 1 or more intersections
    //      var result = {
    //        hit: true,
    //        point: 'a Vector3 containing the CLOSEST VALID intersection',
    //        normal: 'a vector3 containing a unit length normal at the intersection point',
    //        distance: 'a scalar containing the intersection distance from the ray origin'
    //      }


   
    // An object created from a literal that we will return as our result
    // Replace the null values in the properties below with the right values
    var result = {
      hit: null,      // should be of type Boolean
      point: null,    // should be of type Vector3
      normal: null,   // should be of type Vector3
      distance: null, // should be of type Number (scalar)
    };

    //discriminant of sqrt((2*dhat(o-c))^2 - 4(dhat * dhat)(o - c)(o-c)); 
    //dhat= ray.direction, o= ray.origin, c= sphere.center
    var a = r1.direction.dot(r1.direction);
    var b = (r1.direction.clone().multiplyScalar(2)).dot( (r1.origin.clone().subtract(this.center)));
    var c = ((r1.origin.clone()).subtract(this.center)).dot(((r1.origin.clone()).subtract(this.center))) - (this.radius)**2;
    
    var discrim =   b**2 - 4*(a*c) ;
    var alpha1 = (-b - Math.sqrt(discrim))/(2*a); //quadratic to get scalar 
    var alpha2 = (-b + Math.sqrt(discrim))/(2*a); //addition quadratic
   
    //find the lowest scaler
    var minAlpha;
    if( alpha1 > alpha2){
      minAlpha = alpha2;
    }
    else{
      minAlpha = alpha1;
    }

      if ( discrim >= 0 && minAlpha > 0 ){
        var intersection = r1.origin.clone().add(r1.direction.clone().multiplyScalar(minAlpha)); // Intersection of ray and sphrere
        result.hit = true;
        result.point = intersection;
        result.distance = minAlpha; //Alpha is what we use to scale ray direction to intersect with sphere. Makes sense that this would be distance
        result.normal = intersection.clone().subtract(this.center.clone()).normalize(); // use vector subtraction to get the vector that goes to intersection from the center
      }
    
      else{
        result.hit = false;
      }
    

    return result;
  }
}

// EOF 00100001-10