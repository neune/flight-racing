﻿#pragma strict

private var speed : float;

var interval : float;
var acceleration : float;
var defaultSpeed : float;

enum EnemyState
{
	NORMAL		= 0,
	CRASHED		= 1,
	SLIPED		= 2,
	ENEMY_STATE_TOTAL,
}

private var curState : EnemyState;
private var crashedTime : int;

var nextDir : Vector3;


defaultSpeed = 10.0f;
acceleration = 0.05f;
interval = 0.2f;
crashedTime = 0;

curState = EnemyState.NORMAL;

speed = 0.0f;

function Update()
{
	switch( curState ){
		case EnemyState.NORMAL:
			// Calculate next direction.
			nextDir = GetComponent( Path_Finding ).GetNextDir();
			// ( defaultSpeed - interval ) < speed < ( defaultSpeed + interval )
			if( speed < defaultSpeed - interval ){
				speed += acceleration;
			}
			if( speed > defaultSpeed + interval ){
				speed -= acceleration;
			}
			rigidbody.velocity = nextDir * speed;
			break;
		case EnemyState.CRASHED:
			speed = 0.0f;
			--crashedTime;
			if( crashedTime <= 0 ){
				curState = EnemyState.NORMAL;
			}
			break;
		case EnemyState.SLIPED:
			speed -= 0.03f;
			if( speed < 0.0f ){
				curState = EnemyState.NORMAL;
				speed = 0.0f;
			}
			break;
		default:
			break;
	}
	
	rigidbody.velocity = nextDir * speed;
}


// Process collision
function OnCollisionEnter( col : Collision )
{
	// Collide with item.
	if( col.gameObject.tag == "Attack" ){
		//Slow();
		col.gameObject.SendMessage( "CollidedByRacer" );
	}
}

// Sliped (Slow down).
function Slow()
{
	curState = EnemyState.SLIPED;
}

// Crashed (Stop movement).
function Crash()
{
	crashedTime = 60;
	curState = EnemyState.CRASHED;
}

@script AddComponentMenu( "Enemy/EnemyController" )