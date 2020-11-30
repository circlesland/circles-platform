export class FissionPaths {
  static odentityDir() {
    return window.o.fissionAuth.fs.appPath(["odentity"])
  }
  static publicOdentityDir() {
    return "public/odentity"
  }
  static profile() {
    return window.o.fissionAuth.fs.appPath(["odentity", "profile.json"])
  }
  static publicProfile() {
    return "public/odentity/profile.json"
  }
  static keysDir() {
    return window.o.fissionAuth.fs.appPath(["keys"])
  }
  static safe() {
    return window.o.fissionAuth.fs.appPath(["keys", "safe.json"])
  }
}
