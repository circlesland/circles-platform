export class FissionPaths {
  static odentityDir() {
    return window.o.fissionAuth.fs.appPath(["odentity"])
  }
  static profile() {
    return window.o.fissionAuth.fs.appPath(["odentity", "profile.json"])
  }
  static keysDir() {
    return window.o.fissionAuth.fs.appPath(["keys"])
  }
  static safe() {
    return window.o.fissionAuth.fs.appPath(["keys", "safe.json"])
  }
}
