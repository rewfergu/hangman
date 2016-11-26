import React from 'react';
import Matter from 'matter-js';

export default class Gallows extends React.Component {

  constructor(props) {
    super(props);

    this.engine = null;

    this.noggin = null;
    this.nogginConstraint = null;
    this.neck = null;
    this.torso = null;
    this.spacer = null;
    this.spacerConstraint = null;
    this.rightLeg = null;
    this.rightHip = null;
    this.leftLeg = null;
    this.leftHip = null;
    this.rightArm = null;
    this.rightShoulder = null;
  }

  componentDidMount() {
    var gallows = document.getElementById('gallows');
    // var w = window.innerWidth;
    var w = gallows.offsetWidth;
    // var h = window.innerHeight;
    var h = gallows.offsetHeight;

    // Matter.js module aliases
    var Engine = Matter.Engine;
    // var World = Matter.World;
    var Bodies = Matter.Bodies;
    var Body = Matter.Body;
    var Constraint = Matter.Constraint;
    // var Composite = Matter.Composite;
    var Composites = Matter.Composites;
    var MouseConstraint = Matter.MouseConstraint;

    let base = null;
    let group = null;
    let rows = null;
    let columns = null;
    let columnGap = null;
    let rowGap = null;
    let rope = null;
    let baseConstraint = null;
    let circlex = null;
    let circley = null;




    // create a Matter.js engine
    this.engine = Matter.Engine.create({
      render: {
        element: document.getElementById('gallows'),
        options: {
          width: document.getElementById('gallows').offsetWidth,
          height: document.getElementById('gallows').offsetHeight,
          background: 'transparent',
          pixelRatio: 1,
          wireframeBackground: '#222',
          hasBounds: false,
          enabled: true,
          wireframes: false,
          showSleeping: true,
          showDebug: false,
          showBroadphase: false,
          showBounds: false,
          showVelocity: false,
          showCollisions: false,
          showSeparations: false,
          showAxes: false,
          showPositions: false,
          showAngleIndicator: false,
          showIds: false,
          showShadows: false,
          showVertexNumbers: false,
          showConvexHulls: false,
          showInternalEdges: false,
          showMousePosition: false,
        },
      },
    });

    // add a mouse controlled constraint
    Matter.World.add(this.engine.world, MouseConstraint.create(this.engine));


    // var addToWorld = [];
    // var worldArray = [];
    // var prevPoly;

    //
    // create one polygon
    //
    //                            ⬇ offset
    base = Bodies.polygon(w / 2, -200, 5, 20, {
      render: {
        fillStyle: '#555',
        strokeStyle: '#fff',
        lineWidth: 2,
      },
      density: Math.random() * 0.1,
      isStatic: true,
      restitution: Math.random() * 1,
    });
    Matter.World.add(this.engine.world, base);


    //
    // create chain
    //
    group = Body.nextGroup(true);

    rows = 10;
    columns = 1;
    columnGap = 10;
    rowGap = 0;

    rope = Composites.stack(base.position.x, base.bounds.max.y, columns, rows, columnGap, rowGap, function(x, y) {
      return Bodies.rectangle(x, y, 5, 5, {
        collisionFilter: {
          group,
        },
        render: {
          fillStyle: 'white',
          strokeStyle: 'white',
          lineWidth: 0,
        },
      });
    });
    Composites.chain(rope, 0.5, 0, -0.5, 0, {
      stiffness: 0.8,
      length: 15,
      render: {
        fillStyle: 'white',
        strokeStyle: 'white',
        lineWidth: 2,
      },
    });
    base.collisionFilter.group = group;
    base.collisionFilter.group = group;

    baseConstraint = Constraint.create({
      bodyA: base,
      bodyB: rope.bodies[0],
      render: {
        fillStyle: 'white',
        strokeStyle: 'white',
        lineWidth: 2,
      },
      stiffness: 0.5,
    });

    Matter.World.add(this.engine.world, rope);
    Matter.World.add(this.engine.world, baseConstraint);


    //
    // head
    // 
    circlex = w / 2;
    circley = rope.bodies[rope.bodies.length - 1].position.y + 20;

    this.noggin = Bodies.circle(circlex, circley, 20, {
      collisionFilter: { group: -1 },
      render: {
        fillStyle: '#fff',
        strokeStyle: '#fff',
        lineWidth: 2,
        visible: false,
      },
    });

    this.nogginConstraint = Constraint.create({
      bodyA: rope.bodies[rope.bodies.length - 1],
      bodyB: this.noggin,
      pointB: { x: 0, y: -20 },
      render: {
        fillStyle: 'white',
        strokeStyle: 'white',
        visible: true,
        lineWidth: 2,
      },
      stiffness: 0.5,
    });

    Matter.World.add(this.engine.world, [this.nogginConstraint, this.noggin]);


    //
    // torso
    //
    this.torso = Bodies.rectangle(this.noggin.position.x, this.noggin.position.y + 60, 40, 100, {
      collisionFilter: { group: -1 },
      options: {
        //angle: 90,
      },
      render: {
        fillStyle: 'white',
        strokeStyle: 'white',
        lineWidth: 2,
        visible: false,
      },
    });

    this.spacer = Bodies.rectangle(this.torso.position.x, this.torso.position.y + 20, 54, 40, {
      collisionFilter: { group: -1 },
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
      },
    });

    this.spacerConstraint = Constraint.create({
      bodyA: this.torso,
      pointA: { x: 0, y: 20 },
      bodyB: this.spacer,
      stiffness: 0.9,
      render: {
        strokeStyle: 'transparent',
      },
    });

    this.neck = Constraint.create({
      bodyA: this.torso,
      pointA: { x: 0, y: -50 },
      bodyB: this.noggin,
      pointB: { x: 0, y: 15 },
      render: {
        strokeStyle: 'white',
        lineWidth: 20,
        visible: false,
      },
      stiffness: 0.51,
    });

    Matter.World.add(this.engine.world, [this.neck, this.torso, this.spacerConstraint, this.spacer]);


    //
    // right leg
    //
    this.rightLeg = Bodies.rectangle(this.torso.position.x + 20, this.torso.position.y + 120, 10, 60, {
      collisionFilter: { group: -1 },
      render: {
        fillStyle: 'white',
        strokeStyle: '#fff',
        lineWidth: 2,
        visible: false,
      },
    });

    this.rightHip = Constraint.create({
      bodyA: this.rightLeg,
      pointA: { x: 0, y: -25 },
      bodyB: this.torso,
      pointB: { x: 15, y: 45 },
      render: {
        strokeStyle: 'white',
        lineWidth: 12,
        visible: false,
      },
      stiffness: 0.5,
    });

    Matter.World.add(this.engine.world, [this.rightLeg, this.rightHip]);

    //
    // left leg
    //
    this.leftLeg = Bodies.rectangle(this.torso.position.x - 20, this.torso.position.y + 120, 10, 60, {
      collisionFilter: { group: -1 },
      render: {
        fillStyle: 'white',
        strokeStyle: '#fff',
        lineWidth: 2,
        visible: false,
      },
    });

    this.leftHip = Constraint.create({
      bodyA: this.leftLeg,
      pointA: { x: 0, y: -25 },
      bodyB: this.torso,
      pointB: { x: -15, y: 45 },
      render: {
        strokeStyle: 'white',
        lineWidth: 12,
        visible: false,
      },
      stiffness: 0.5,
    });

    Matter.World.add(this.engine.world, [this.leftHip, this.leftLeg]);

    //
    // right arm
    //
    this.rightArm = Bodies.rectangle(this.torso.position.x + 25, this.torso.position.y + 20, 10, 50, {
      collisionFilter: { group: 1 },
      render: {
        fillStyle: 'white',
        strokeStyle: '#fff',
        lineWidth: 2,
        visible: false,
      },
    });

    this.rightShoulder = Constraint.create({
      bodyA: this.torso,
      pointA: { x: 20, y: -50 },
      bodyB: this.rightArm,
      pointB: { x: 0, y: -25 },
      render: {
        strokeStyle: 'white',
        lineWidth: 12,
        visible: false,
      },
      stiffness: 0.95,
    });

    Matter.World.add(this.engine.world, [this.rightShoulder, this.rightArm]);


    //
    // left arm
    //
    this.leftArm = Bodies.rectangle(this.torso.position.x - 25, this.torso.position.y + 20, 10, 50, {
      collisionFilter: { group: 1 },
      render: {
        fillStyle: 'white',
        strokeStyle: '#fff',
        lineWidth: 2,
        visible: false,
      },
    });

    this.leftShoulder = Constraint.create({
      bodyA: this.torso,
      pointA: { x: -20, y: -50 },
      bodyB: this.leftArm,
      pointB: { x: 0, y: -25 },
      render: {
        strokeStyle: 'white',
        lineWidth: 12,
        visible: false,
      },
      stiffness: 0.95,
    });

    Matter.World.add(this.engine.world, [this.leftShoulder, this.leftArm]);



    // turn gravity off
    this.engine.world.gravity.y = 2;
    this.engine.world.gravity.x = 0.1;

    // run the engine
    Engine.run(this.engine);

    window.setInterval(() => {
      this.engine.world.gravity.x *= -1;
    }, 1500);
  }

  componentDidUpdate() {
    console.log('guesses', this.props.remainingGuesses);
    if (this.props.remainingGuesses > 5) {
      this.noggin.render.visible = false;
      this.neck.render.visible = false;
      this.torso.render.visible = false;
      
      this.leftShoulder.render.visible = false;
      this.leftArm.render.visible = false;
      this.rightShoulder.render.visible = false;
      this.rightArm.render.visible = false;

      this.leftHip.render.visible = false;
      this.leftLeg.render.visible = false;
      this.rightHip.render.visible = false;
      this.rightLeg.render.visible = false;
    }


    if (this.props.remainingGuesses < 6) {
      this.noggin.render.visible = true;
    }
    if (this.props.remainingGuesses < 5) {
      this.neck.render.visible = true;
      this.torso.render.visible = true;
    }
    if (this.props.remainingGuesses < 4) {
      this.leftShoulder.render.visible = true;
      this.leftArm.render.visible = true;
    }
    if (this.props.remainingGuesses < 3) {
      this.rightShoulder.render.visible = true;
      this.rightArm.render.visible = true;
    }
    if (this.props.remainingGuesses < 2) {
      this.leftHip.render.visible = true;
      this.leftLeg.render.visible = true;
    }
    if (this.props.remainingGuesses < 1) {
      this.rightHip.render.visible = true;
      this.rightLeg.render.visible = true;
    }
  }

  render() {
    return (
      <div id="gallows" className="gallows" />
    );
  }

}




/*

<svg width="100%" viewBox="0 0 200 500">
          <g id="gallowRope">
            <line x1="100" y1="0" x2="100" y2="165" />
            <circle cx="100" cy="175" r="16" />
          </g>
          <g id="gallowMan">
            <circle
              id="noggin"
              className={this.props.remainingGuesses < 6 ? 'op-on' : 'op-off'}
              cx="100" cy="158" r="30"
            />
            <line
              id="torso"
              className={this.props.remainingGuesses < 5 ? 'op-on' : 'op-off'}
              x1="100" y1="193" x2="100" y2="290"
            />
            <line
              id="arm-left"
              className={this.props.remainingGuesses < 4 ? 'op-on' : 'op-off'}
              x1="100" y1="220" x2="45" y2="250"
            />
            <line
              id="arm-right"
              className={this.props.remainingGuesses < 3 ? 'op-on' : 'op-off'}
              x1="100" y1="220" x2="155" y2="250"
            />
            <line
              id="leg-left"
              className={this.props.remainingGuesses < 2 ? 'op-on' : 'op-off'}
              x1="100" y1="285" x2="55" y2="350"
            />
            <line
              id="leg-right"
              className={this.props.remainingGuesses < 1 ? 'op-on' : 'op-off'}
              x1="100" y1="285" x2="145" y2="350"
            />
          </g>
        </svg>

        */