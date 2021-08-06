export function MotionValue(key, x, destX, entity) {
  this.key = key;
  this.x = x;
  this.v = entity.velocity;
  this.destX = destX;
  this.config = entity.config;
  this.precision = entity.precision;
  this.step = entity.step;
  this._interpolate = entity.interpolate;
}

MotionValue.prototype.update = function update() {
  let [x, v] = this.step(this.x, this.v, this.destX, this.config, this.precision);
  this.x = x;
  this.v = v;
  // this.completed = this.v === 0 && this.x === this.destX;
};

MotionValue.prototype.interpolate = function interpolate(completion) {
  let [x] = this.step(this.x, this.v, this.destX, this.config, this.precision);
  let interpolated = this._interpolate(this.x, x, completion);
  return interpolated;
};

export function serializeMotionState(state) {
  let serialized = Object.create(state);
  for (let key in state) {
    let target = state[key];
    serialized[key] = isMotionConfig(target) ? target.value : target;
  }
  return serialized;
}

export function isMotionConfig(target) {
  return target != null && typeof target.step === 'function';
}
