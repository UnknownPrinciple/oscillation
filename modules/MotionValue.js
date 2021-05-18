export function MotionValue(key, x, destX, entity) {
  this.key = key;
  this.x = x;
  this.v = 0;
  this.destX = destX;
  this.config = entity.config;
  this.precision = entity.precision;
  this.step = entity.step;
}

MotionValue.prototype.update = function update() {
  let [x, v] = this.step(this.x, this.v, this.destX, this.config, this.precision);
  this.x = x;
  this.v = v;
};

MotionValue.prototype.interpolate = function interpolate(completion) {
  let [x] = this.step(this.x, this.v, this.destX, this.config, this.precision);
  let interpolated = this.x + (x - this.x) * completion;
  return interpolated;
};
