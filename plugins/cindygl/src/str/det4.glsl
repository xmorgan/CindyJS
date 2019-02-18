float det4(mat4 a) {
  float s00 = a[0][0]*a[1][1] - a[0][1]*a[1][0],
  s01 = a[0][0]*a[1][2] - a[0][2]*a[1][0],
  s02 = a[0][0]*a[1][3] - a[0][3]*a[1][0],
  s03 = a[0][1]*a[1][2] - a[0][2]*a[1][1],
  s04 = a[0][1]*a[1][3] - a[0][3]*a[1][1],
  s05 = a[0][2]*a[1][3] - a[0][3]*a[1][2],
  s06 = a[2][0]*a[3][1] - a[2][1]*a[3][0],
  s07 = a[2][0]*a[3][2] - a[2][2]*a[3][0],
  s08 = a[2][0]*a[3][3] - a[2][3]*a[3][0],
  s09 = a[2][1]*a[3][2] - a[2][2]*a[3][1],
  s10 = a[2][1]*a[3][3] - a[2][3]*a[3][1],
  s11 = a[2][2]*a[3][3] - a[2][3]*a[3][2];
  return s00 * s11 - s01 * s10 + s02 * s09 + s03 * s08 - s04 * s07 + s05 * s06;
}