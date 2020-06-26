class Cube {
  constructor(cubeOrientation) {

    this.top = cubeOrientation[0];
    this.left = cubeOrientation[1];
    this.front = cubeOrientation[2];
    this.right = cubeOrientation[3];
    this.bottom = cubeOrientation[4];
    this.back = cubeOrientation[5];

    //rotation of the cubes
    var cube0 = [0,0,0];
    var cube1 = [0,0,0];
    var cube2 = [0,0,0];
    var cube3 = [0,0,0];
    var cube4 = [0,0,0];
    var cube5 = [0,0,0];
    var cube6 = [0,0,0];
    var cube7 = [0,0,0];

    this.cubes = [cube0, cube1, cube2, cube3, cube4, cube5, cube6, cube7];

    //face to cube pointers from the orig settings
    this.faceToCube = {
      "top": [4, 5, 6, 7],
      "left": [4, 6, 0, 2],
      "front": [6, 7, 2, 3],
      "right": [7, 5, 3, 1],
      "bottom": [6, 7, 2, 3],
      "back": [0, 1, 4, 5]
    };


    this.animating = false;

    this.rotateStep = 0;
  }

  getCubeOrientation(){
    return [this.top, this.left, this.front, this.right, this.bottom, this.back]
  }

  getColorsCube(x, y, z){
    var colorArray = [];

    if(y==1){
      //top
      colorArray = colorArray.concat(this.top[2*z+x]);
      //left
      if(x==0) colorArray = colorArray.concat(this.left[z]);
      else colorArray = colorArray.concat(0);
      //front
      if(z==1) colorArray = colorArray.concat(this.front[x]);
      else colorArray = colorArray.concat(0);
      //right
      if(x==1) colorArray = colorArray.concat(this.right[1-z]);
      else colorArray = colorArray.concat(0);
      //bottom
      colorArray = colorArray.concat(0);
      //back
      if(z==0) colorArray = colorArray.concat(this.back[2+x]);
      else colorArray = colorArray.concat(0);
    }
    else if(y==0){
      //top
      colorArray = colorArray.concat(0);
      //left
      if(x==0) colorArray = colorArray.concat(this.left[2+z]);
      else colorArray = colorArray.concat(0);
      //front
      if(z==1) colorArray = colorArray.concat(this.front[2+x]);
      else colorArray = colorArray.concat(0);
      //right
      if(x==1) colorArray = colorArray.concat(this.right[2+(1-z)]);
      else colorArray = colorArray.concat(0);
      //bottom
      colorArray = colorArray.concat(this.bottom[2*(1-z)+x]);
      //back
      if(z==0) colorArray = colorArray.concat(this.back[x]);
      else colorArray = colorArray.concat(0);
    }
    else{ colorArray = [1, 1, 1, 1, 1, 1]}
    
    return colorArray;
  }

  whiteSolved(){
    if(this.top[0] == this.top[2] == this.top[3] == this.top[1] == 1){
      if(this.front[0] == this.front[1] && this.left[0] == this.left[1] 
        && this.right[0] == this.right[1] && this.back[2] == this.back[3])
        return 1;
    }
    if(this.left[0] == this.left[2] == this.left[3] == this.left[1] == 1){
      if(this.front[0] == this.front[2] && this.top[0] == this.top[2] 
        && this.bottom[0] == this.bottom[2] && this.back[2] == this.back[0])
        return 2;
    }
    if(this.bottom[0] == this.bottom[2] == this.bottom[3] == this.bottom[1] == 1){
      if(this.front[2] == this.front[3] && this.left[2] == this.left[3]
        && this.front[2] == this.front[3] && this.back[0] == this.back[1])
        return 3;
    }
    if(this.right[0] == this.right[2] == this.right[3] == this.right[1] == 1){
      if(this.front[1] == this.front[3] && this.top[1] == this.top[3] 
        && this.bottom[1] == this.bottom[3] && this.back[1] == this.back[3])
        return 4;
    }
    if(this.back[0] == this.back[2] == this.back[3] == this.back[1] == 1){
      if(this.right[1] == this.right[3] && this.top[0] == this.top[1] 
        && this.bottom[2] == this.bottom[3] && this.left[2] == this.left[0])
        return 5;
    }
    if(this.front[0] == this.front[2] == this.front[3] == this.front[1] == 1){
      if(this.right[0] == this.right[2] && this.top[2] == this.top[3] 
        && this.bottom[1] == this.bottom[0] && this.left[1] == this.left[3])
        return 6;
    }
    return -1;
  }

  step2Solved(){
    var whiteFace = this.whiteSolved()
    
    if (whiteFace == -1)
      return -1;

    if (whiteFace == 1){
      if(this.bottom[0] == this.bottom[2] && this.bottom[3] == this.bottom[1] && this.bottom[0] == this.bottom[1]) return 1;
    }

    if (whiteFace == 2){
      if(this.right[0] == this.right[2] && this.right[3] == this.right[1] && this.right[0] == this.right[1]) return 1;
    }

    if (whiteFace == 3){
      if(this.top[0] == this.top[2] && this.top[3] == this.top[1] && this.top[0] == this.top[1]) return 1;
    }

    if (whiteFace == 4){
      if(this.left[0] == this.left[2] && this.left[3] == this.left[1] && this.left[0] == this.left[1]) return 1;
    }

    if (whiteFace == 5){
      if(this.front[0] == this.front[2] && this.front[3] == this.front[1] && this.front[0] == this.front[1]) return 1;
    }

    if (whiteFace == 6){
      if(this.back[0] == this.back[2] && this.back[3] == this.back[1] && this.back[0] == this.back[1]) return 1;
    }

    return -1;
  }

  solved(){
    if(this.bottom[0] == this.bottom[2] && this.bottom[3] == this.bottom[1] && this.bottom[0] == this.bottom[1]
        && this.right[0] == this.right[2] && this.right[3] == this.right[1] && this.right[0] == this.right[1]
        && this.top[0] == this.top[2] && this.top[3] == this.top[1] && this.top[0] == this.top[1]
        && this.left[0] == this.left[2] && this.left[3] == this.left[1] && this.left[0] == this.left[1]
        && this.front[0] == this.front[2] && this.front[3] == this.front[1] && this.front[0] == this.front[1]
        && this.back[0] == this.back[2] && this.back[3] == this.back[1] && this.back[0] == this.back[1]
      )
      return 1;
    return -1;
  }

  getRotation(x,y,z){
    if(x==0&&y==0&&z==0)
      return this.cubes[0];
    if(x==1&&y==0&&z==0)
      return this.cubes[1];
    if(x==0&&y==0&&z==1)
      return this.cubes[2];
    if(x==1&&y==0&&z==1)
      return this.cubes[3];

    if(x==0&&y==1&&z==0)
      return this.cubes[4];
    if(x==1&&y==1&&z==0)
      return this.cubes[5];
    if(x==0&&y==1&&z==1)
      return this.cubes[6];
    if(x==1&&y==1&&z==1)
      return this.cubes[7];
  }

  rotateLeft(){
    //rotate left side by 90 from normal

    // Change current faces set up
    var tmp = [this.left[1], this.left[3], this.left[0], this.left[2]];
    this.left = tmp;

    var tmpTop = [this.front[0], this.top[1], this.front[2], this.top[3]];
    var tmpFront = [this.bottom[0], this.front[1], this.bottom[2], this.front[3]];
    var tmpBottom = [this.back[0], this.bottom[1], this.back[2], this.bottom[3]];
    var tmpBack = [this.top[0], this.back[1], this.top[2], this.back[3]];

    this.top = tmpTop;
    this.front = tmpFront;
    this.bottom = tmpBottom;
    this.back = tmpBack;
  }

  rotateTop(){
    //rotate top side by 90 from normal

    // Change current faces set up
    var tmp = [this.top[1], this.top[3], this.top[0], this.top[2]];
    this.top = tmp;

    var tmpLeft = [this.back[3], this.back[2], this.left[2], this.left[3]];
    var tmpFront = [this.left[0], this.left[1], this.front[2], this.front[3]];
    var tmpRight = [this.front[0], this.front[1], this.right[2], this.right[3]];
    var tmpBack = [this.back[0], this.back[1], this.right[1], this.right[0]];

    this.left = tmpLeft;
    this.front = tmpFront;
    this.right = tmpRight;
    this.back = tmpBack;
  }

  rotateFront(){
    // Change current faces set up
    var tmp = [this.front[1], this.front[3], this.front[0], this.front[2]];
    this.front = tmp;

    var tmpLeft = [this.left[0], this.top[3], this.left[2], this.top[2]];
    var tmpBottom = [this.left[1], this.left[3], this.bottom[2], this.bottom[3]];
    var tmpRight = [this.bottom[1], this.right[1], this.bottom[0], this.right[3]];
    var tmpTop = [this.top[0], this.top[1], this.right[0], this.right[2]];

    this.left = tmpLeft;
    this.bottom = tmpBottom;
    this.right = tmpRight;
    this.top = tmpTop;
  }

  rotateRight(){
    // Change current faces set up
    var tmp = [this.right[1], this.right[3], this.right[0], this.right[2]];
    this.right = tmp;

    var tmpTop = [this.top[0], this.back[1], this.top[2], this.back[3]];
    var tmpFront = [this.front[0], this.top[1], this.front[2], this.top[3]];
    var tmpBottom = [this.bottom[0], this.front[1], this.bottom[2], this.front[3]];
    var tmpBack = [this.back[0], this.bottom[1], this.back[2], this.bottom[3]];

    this.top = tmpTop;
    this.front = tmpFront;
    this.bottom = tmpBottom;
    this.back = tmpBack;
  }

  rotateBottom(){
    // Change current faces set up
    var tmp = [this.bottom[1], this.bottom[3], this.bottom[0], this.bottom[2]];
    this.bottom = tmp;

    var tmpLeft = [this.left[0], this.left[1], this.front[2], this.front[3]];
    var tmpFront = [this.front[0], this.front[1], this.right[2], this.right[3]];
    var tmpRight = [this.right[0], this.right[1], this.back[1], this.back[0]];
    var tmpBack = [this.left[3], this.left[2], this.back[2], this.back[3]];

    this.left = tmpLeft;
    this.front = tmpFront;
    this.right = tmpRight;
    this.back = tmpBack;
  }

  rotateBack(){
    // Change current faces set up
    var tmp = [this.back[1], this.back[3], this.back[0], this.back[2]];
    this.back = tmp;

    var tmpTop = [this.left[2], this.left[0], this.top[2], this.top[3]];
    var tmpLeft = [this.bottom[2], this.left[1], this.bottom[3], this.left[3]];
    var tmpBottom = [this.bottom[0], this.bottom[1], this.right[3], this.right[1]];
    var tmpRight = [this.right[0], this.top[0], this.right[2], this.top[1]];

    this.top = tmpTop;
    this.left = tmpLeft;
    this.bottom = tmpBottom;
    this.right = tmpRight;
  }

  animateLeft(STEPS, dir){
    //animate cube rotation
    this.cubes[0][0] = this.cubes[0][0] - dir*Math.PI/2.0/STEPS;
    this.cubes[2][0] = this.cubes[2][0] - dir*Math.PI/2.0/STEPS;
    this.cubes[4][0] = this.cubes[4][0] - dir*Math.PI/2.0/STEPS;
    this.cubes[6][0] = this.cubes[6][0] - dir*Math.PI/2.0/STEPS;

    this.rotateStep = this.rotateStep + 1;

    if(this.rotateStep >= STEPS){
      this.animating = false;
      this.rotateStep = 0;
    }
  }

  animateTop(STEPS, dir){
    //animate cube rotation
    this.cubes[4][1] = this.cubes[4][1] + dir*Math.PI/2.0/STEPS;
    this.cubes[5][1] = this.cubes[5][1] + dir*Math.PI/2.0/STEPS;
    this.cubes[6][1] = this.cubes[6][1] + dir*Math.PI/2.0/STEPS;
    this.cubes[7][1] = this.cubes[7][1] + dir*Math.PI/2.0/STEPS;

    this.rotateStep = this.rotateStep + 1;

    if(this.rotateStep >= STEPS){
      this.animating = false;
      this.rotateStep = 0;
    }
  }

  animateFront(STEPS, dir){
    //animate cube rotation
    this.cubes[6][2] = this.cubes[6][2] + dir*Math.PI/2.0/STEPS;
    this.cubes[7][2] = this.cubes[7][2] + dir*Math.PI/2.0/STEPS;
    this.cubes[2][2] = this.cubes[2][2] + dir*Math.PI/2.0/STEPS;
    this.cubes[3][2] = this.cubes[3][2] + dir*Math.PI/2.0/STEPS;

    this.rotateStep = this.rotateStep + 1;

    if(this.rotateStep >= STEPS){
      this.animating = false;
      this.rotateStep = 0;
    }
  }

  animateRight(STEPS, dir){
    //animate cube rotation
    this.cubes[5][0] = this.cubes[5][0] + dir*Math.PI/2.0/STEPS;
    this.cubes[7][0] = this.cubes[7][0] + dir*Math.PI/2.0/STEPS;
    this.cubes[1][0] = this.cubes[1][0] + dir*Math.PI/2.0/STEPS;
    this.cubes[3][0] = this.cubes[3][0] + dir*Math.PI/2.0/STEPS;

    this.rotateStep = this.rotateStep + 1;

    if(this.rotateStep >= STEPS){
      this.animating = false;
      this.rotateStep = 0;
    }
  }

  animateBottom(STEPS, dir){
    //animate cube rotation
    this.cubes[0][1] = this.cubes[0][1] - dir*Math.PI/2.0/STEPS;
    this.cubes[1][1] = this.cubes[1][1] - dir*Math.PI/2.0/STEPS;
    this.cubes[2][1] = this.cubes[2][1] - dir*Math.PI/2.0/STEPS;
    this.cubes[3][1] = this.cubes[3][1] - dir*Math.PI/2.0/STEPS;

    this.rotateStep = this.rotateStep + 1;

    if(this.rotateStep >= STEPS){
      this.animating = false;
      this.rotateStep = 0;
    }
  }

  animateBack(STEPS, dir){
    //animate cube rotation
    this.cubes[0][2] = this.cubes[0][2] - dir*Math.PI/2.0/STEPS;
    this.cubes[1][2] = this.cubes[1][2] - dir*Math.PI/2.0/STEPS;
    this.cubes[4][2] = this.cubes[4][2] - dir*Math.PI/2.0/STEPS;
    this.cubes[5][2] = this.cubes[5][2] - dir*Math.PI/2.0/STEPS;

    this.rotateStep = this.rotateStep + 1;

    if(this.rotateStep >= STEPS){
      this.animating = false;
      this.rotateStep = 0;
    }
  }

  resetRotation(){
    //rotation of the cubes
    var cube0 = [0,0,0];
    var cube1 = [0,0,0];
    var cube2 = [0,0,0];
    var cube3 = [0,0,0];
    var cube4 = [0,0,0];
    var cube5 = [0,0,0];
    var cube6 = [0,0,0];
    var cube7 = [0,0,0];

    this.cubes = [cube0, cube1, cube2, cube3, cube4, cube5, cube6, cube7];
  }
}