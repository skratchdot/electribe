'use strict';

var Format = require('bin-format');
var Utils = require('./utils');
var Const = require('./constants');
var Enum = require('./enum');
var Common = require('./common');

// Reference: TABLE23
class AudioInSequenceSteps {
	constructor(data) {
		this.steps = [];
		for (var i = 7; i >= 0; i--) {
			this.steps.push( data & (1 << i) ? 1 : 0 );
		}
	}

	serialize() {
		return Utils.uintFromBits(this.steps);
	}
}

var SequenceGate = new Format()
	.uint8('gate');

var Bar = new Format()
	.uint8('steps', AudioInSequenceSteps);

var AudioInPart = new Format()
	.nest('filtertype', Common.FilterType)
	.uint8('cutoff') // 0-127
	.uint8('resonance') // 0-127
	.uint8('egint') // 0~64~127 : -63~0~+63
	.uint8('level') // 0-127
	.uint8('pan') // 0~127 (64=center)
	.uint8('egtime') // 0-127
	.uint8('fxflags', Common.FXFlags)
	.uint8('modflags', Common.ModFlags)
	.uint8('modspeed') // 0-127
	.uint8('moddepth') // 0~64~127 : -63~0~+63
	.nest('motionseqstatus', Common.MotionSequenceStatus) // 0~2 : Off/Smooth/TrigHold
	.list('sequencedata', Const.NUM_SEQUENCE_DATA, Bar)
	.list('sequencegate', Const.NUM_SEQUENCE_DATA_GATE, SequenceGate)
	;

module.exports = AudioInPart;
