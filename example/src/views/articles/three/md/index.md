## Three.js 开发指南读书笔记

## 1 Three.js 基本使用

#### 1.2 Copy 源码，启动本地服务

源码的 GitHub 地址：[https://github.com/josdirksen/learning-threejs](https://github.com/josdirksen/learning-threejs)。

这本书的 Three.js 版本比较老，很多 API 都更新了，如果下载最新 Three.js 粘贴代码运行会有问题，多看看 Three.js 官网。示例
中都是使用下载的 js 文件，现在最好使用 npm 安装对应的包，很多工具库都更新了，已经不在提供 js 文件了。

本地服务我使用的 Python 启动的，Python3 的版本所以启动命令是：

```shell
python3 -m http.server
```

#### 1.4 基础图形绘制

Talk is cheap, show me the code。首先创建一个简单场景，添加几个物体和摄像机，下面是会用到的一些对象，和基础概念

代码如下（需要下载 Three.js 库）：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Example 01.02 - First Scene</title>
    <script type="text/javascript" src="../libs/three.js"></script>
    <style>
      body {
        /* set margin to 0 and overflow to hidden, to go fullscreen */
        margin: 0;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <!-- Div which will hold the Output -->
    <div id="WebGL-output"></div>

    <!-- Javascript code that runs our Three.js examples -->
    <script type="text/javascript">
      // once everything is loaded, we run our Three.js stuff.
      function init() {
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene()

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

        // create a render and set the size
        var renderer = new THREE.WebGLRenderer()
        renderer.setClearColor(new THREE.Color(0xeeeeee))
        renderer.setSize(window.innerWidth, window.innerHeight)

        // show axes in the screen
        var axes = new THREE.AxesHelper(20)
        scene.add(axes)

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60, 20)
        var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc })
        var plane = new THREE.Mesh(planeGeometry, planeMaterial)

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI
        plane.position.x = 15
        plane.position.y = 0
        plane.position.z = 0

        // add the plane to the scene
        scene.add(plane)

        // create a cube
        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
        var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

        // position the cube
        cube.position.x = -4
        cube.position.y = 3
        cube.position.z = 0

        // add the cube to the scene
        scene.add(cube)

        // create a sphere
        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff, wireframe: true })
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

        // position the sphere
        sphere.position.x = 20
        sphere.position.y = 4
        sphere.position.z = 2

        // add the sphere to the scene
        scene.add(sphere)

        // position and point the camera to the center of the scene
        camera.position.x = -30
        camera.position.y = 40
        camera.position.z = 30
        camera.lookAt(scene.position)

        // add the output of the renderer to the html element
        document.getElementById('WebGL-output').appendChild(renderer.domElement)

        // render the scene
        renderer.render(scene, camera)
      }
      window.onload = init
    </script>
  </body>
</html>
```

代码最开始，创建了一个场景（scene）。顾名思义，场景是一个容器，主要用于保存、跟踪所要渲染的物体和使用的光源。如果没有
THREE.Scene 对象，那么 Three.js 就无法渲染任何物体。接下来是摄像机（camera），摄像机决定了能够在场景看到什么。接下来是一
个渲染器（renderer），该对象会基于摄像机的角度来计算场景对象在浏览器中会渲染成什么样子。这些都是很好理解的概念。

通过 `setClearColor` 方法将场景的背景颜色设置为接近黑色（new THREE.Color（0X00000000）），并通过 `setSize` 方法设置场景
的大小。

```javascript
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
var renderer = new THREE.WebGLRenderer()
renderer.setClearColor(new THREE.Color(0xeeeeee))
renderer.setSize(window.innerWidth, window.innerHeight)
```

接下来，创建坐标轴（axes），和平面（plane）。

创建坐标轴（axes）对象并设置轴线的粗细值为 20，调用 scene.add 方法将轴添加到场景中。接下来创建平面（plane），平面的创建
分为两步来完成。首先，使用 THREE.Plane Geometry（60，20）来定义平面的大小，将宽度设置为 60，高度设置为 20。除了设置高度
和宽度，我们还需要设置平面的外观（比如颜色和透明度），在 Three.js 中通过创建材质对象来设置平面的外观，这里创建了颜色为
0xAAAAAA 的基本材质（THREE.MeshBasicMaterial）。然后，将大小和外观组合进 Mesh 对象并赋值给平面变量。在将平面添加到场景之
前，还需要设置平面的位置：先将平面围绕 x 轴旋转 90 度，然后使用 position 属性来定义其在场景中的位置。

```javascript
var axes = new THREE.AxesHelper(20)
scene.add(axes)
var planeGeometry = new THREE.PlaneGeometry(60, 20)
var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc })
var plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -0.5 * Math.PI
plane.position.x = 15
plane.position.y = 0
plane.position.z = 0
```

接下来添加其他的图形，方法都是类似的，区别在于需要将线框（wireframe）属性设置为 true，这样物体就不会被渲染为实体物体：

```javascript
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.x = -4
cube.position.y = 3
cube.position.z = 0
scene.add(cube)
```

剩下的就是调整摄像机位置和渲染，摄像机位置不同，代表观察视角不同，包含的场景内容也不一样：

```javascript
camera.position.x = -30
camera.position.y = 40
camera.position.z = 30
camera.lookAt(scene.position)
document.getElementById('WebGL-output').appendChild(renderer.domElement)
renderer.render(scene, camera)
```

#### 1.4 材质，灯光，和阴影效果

由于产生阴影的开销比较大，Three.js 对阴影做了限制，需要手动设置才能生成阴影效果

添加光源：

```javascript
var spotLight = new THREE.SpotLight(0xffffff) // 设置光源颜色
spotLight.position.set(-40, 40, -15) // 光源位置
spotLight.castShadow = true // 设置光源可以产生阴影
spotLight.shadow.mapSize.width = 1024 // 阴影光斑像素
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.far = 130
spotLight.shadow.camera.near = 40
scene.add(spotLight) // 添加 spotLight
```

通过 THREE.SpotLight 定义光源并从其位置（spotLight.position.set（-40，60，-10））照射场景。通过将 castShadow 属性设置为
true，THREE.js 的阴影功能被启用。此外，上面的代码还通过设置 shadow.mapSize、shadow.camera.far 和 shadow.camera.near 三个
参数来控制阴影的精细程度。

添加上述代码后，效果并没有区别。这是因为不同材质，对光源的反应是不一样的。基本材质（THREE.MeshBasicMaterial）不会对光源
有效果，基本材质只会渲染物体颜色，如果要看到阴影效果需要改变材质。

将物体的材质进行如下修改：

```javascript
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }) // 将 MeshBasicMaterial 变成 MeshLambertMaterial
```

接下来要告诉渲染器，需要计算阴影

```javascript
renderer.shadowMap.enabled = true // 渲染器开启阴影计算
```

还需要告诉渲染器那些物体需要计算阴影

```javascript
...
plane.receiveShadow = true; // 开启平面的阴影
...
cube.castShadow = true; // 球体阴影
...
sphere.castShadow = true; // 立方体阴影
```

#### 1.6 让场景动起来

如果希望我们的场景动起来，那么首先需要解决的问题是如何在特定的时间间隔重新渲染场景。在 HTML5 和相关的 JavaScript API 出
现之前，是通过使用 setInterval（function，interval）方法来实现的。比如，通过 setInterval()方法指定某个函数每 100 毫秒调
用一次。但是这个方法的缺点在于它不管浏览器当前正在发生什么（比如正浏览其他网页），它都会每隔几毫秒执行一次。除此之外
，setInterval()方法并没与屏幕的刷新同步。这将会导致较高的 CPU 使用率和性能不良。

现代浏览器通过 requestAnimationFrame 函数为稳定而连续的渲染场景提供了良好的解决方案。通过这个函数，你可以向浏览器提供一
个回调函数。你无须定义回调间隔，浏览器将自行决定最佳回调时机。

```javascript
function renderScene() {
  requestAnimationFrame(renderScene)
  renderer.render(scene, camera)
}
```

引入一个工具库 Stats，GitHub 地址： [https://github.com/mrdoob/stats.js](https://github.com/mrdoob/stats.js)，并初始化，
这个库会将帧率，渲染到页面上。

```javascript
const stats = initStats() // 初始化 stats
let step = 0
renderScene()
function renderScene() {
  cube.rotation.x += 0.02 // 添加渲染动画
  cube.rotation.y += 0.02
  cube.rotation.z += 0.02
  step += 0.04
  sphere.position.x = 20 + 10 * Math.cos(step) // 小球弹跳效果
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))
  stats.update() // 每次重绘更新帧率
  requestAnimationFrame(renderScene)
  renderer.render(scene, camera)
}

function initStats(type) {
  const panelType = typeof type !== 'undefined' && type && !isNaN(type) ? parseInt(type) : 0
  const stats = new Stats()

  stats.showPanel(panelType) // 0: fps; 1: ms; 2: mb; 3+: custom
  document.body.appendChild(stats.dom)
  return stats
}
```

#### 1.7 使用 dat.GUI 增强调试

每次都修改代码，来调整动画速率很麻烦，可以引入 dat.GUI 这个库，地址
：[https://github.com/dataarts/dat.gui](https://github.com/dataarts/dat.gui)，使用这个库可以很容易地创建出能够改变代码变
量的界面组件。

```javascript
const controls = new (function () {
  this.rotationSpeed = 0.02
  this.bouncingSpeed = 0.03
})()

const gui = new dat.GUI()
gui.add(controls, 'rotationSpeed', 0, 0.5) // 这样页面上就会有 rotationSpeed 调整的进度条，0-0.5是调整范围
gui.add(controls, 'bouncingSpeed', 0, 0.5)
```

调整 renderScene 方法，使用 controls 的变量

```javascript
function renderScene() {
  cube.rotation.x += controls.rotationSpeed // 使用 GUI 中控制的变量
  cube.rotation.y += controls.rotationSpeed
  cube.rotation.z += controls.rotationSpeed
  step += controls.bouncingSpeed
  sphere.position.x = 20 + 10 * Math.cos(step)
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))
  stats.update()
  requestAnimationFrame(renderScene)
  renderer.render(scene, camera)
}
```

接下来，添加鼠标控制，可以移动摄像机，缩放，旋转，从不同角度观察场景。

引入 `TrackballControls`，文件在官网示例中，需要自己下载
：[TrackballControls](https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/TrackballControls.js)

```javascript
const trackballControls = new TrackballControls(camera, renderer.domElement); // 初始化 TrackballControls

const clock = new THREE.Clock(); // 追踪时间，这里我只是 copy，不确定更新时候这个有什么用，官网没说

function renderScene() {
    trackballControls.update(clock.getDelta()); // 更新 TrackballControls
    ...
  }
```

这样就可以使用鼠标，移动摄像头了（按理说，按键 A，S，D 也可以操作，但是我的项目不行，不知道为什么，github 上找到了解答）
。

[When you press one of the keys e.g. D, you can pan with any mouse button you press. Same for A and S.](https://github.com/mrdoob/three.js/issues/18205)

也就是说，A，S，D 键是锁定操作用的，还需要配合鼠标使用。例如 A 是旋转，按住 A 键后，可以使用鼠标（无论左右键），来旋转。

#### 1.8 浏览器自适应

当浏览器页面缩放时，我们希望自动移动 camera。代码上很好实现，只需要添加一个事件就行：

```javascript
window.addEventListener('resize', onResize, false)

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
```

`camera.aspect` 代表屏幕长宽比，渲染器只需要重新设置长宽就好。

## 2 Three.js 基本组件介绍

#### 2.1 场景

场景（THREE.Scene）之前已经有接触过了，基本上就可以当作我们渲染图形或者动画的容器。

几个常用的属性：

> Scene.add(object)：像场景中添加一个对象
>
> Scene.remove(object)：像场景中移除一个对象
>
> Scene.children：用于获取场景中所有的子对象列表
>
> Scene.getObjectByName：利用 name 属性，用于获取场景中特定的对象
>
> Scene.traverse(handler: (e:object) => any)：traverse()方法会遍历 Scene 的所有对象，接受一个回调函数作为参数，回调中会
> 传入当前子对象。由于 THREE.Scene 对象存储的是对象树，如果子对象本身还有子对象，traverse()方法会在所有的子对象上执行，
> 直到遍历完场景树中的所有对象为止。

结合代码看使用

```javascript
this.addCube = function () {
  // 这个方法随机生成一个 cube，并添加到当前场景中
  const cubeSize = Math.ceil(Math.random() * 3)
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.castShadow = true
  cube.name = 'cube-' + scene.children.length // 给 cube 写入 name，方便以后使用 name 查找

  // position the cube randomly in the scene

  cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width)
  cube.position.y = Math.round(Math.random() * 5)
  cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height)

  // add the cube to the scene
  scene.add(cube)
  this.numberOfObjects = scene.children.length // children 是当前 scene 中所有的对象
}

this.removeCube = function () {
  const allChildren = scene.children
  const lastObject = allChildren[allChildren.length - 1]
  if (lastObject instanceof THREE.Mesh) {
    // 判断对象类型
    scene.remove(lastObject) // 调用 remove 方法，移除子对象
    this.numberOfObjects = scene.children.length
  }
}

function render() {
  stats.update()
  // 这里遍历添加动画
  scene.traverse(function (e) {
    if (e instanceof THREE.Mesh && e != plane) {
      // 判断对象类型
      e.rotation.x += controls.rotationSpeed
      e.rotation.y += controls.rotationSpeed
      e.rotation.z += controls.rotationSpeed
    }
  })
  // render using requestAnimationFrame
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
```

##### 2.1.2 雾化效果

使用 fog 属性就可以为整个场景添加雾化效果。雾化效果是：场景中的物体离摄像机越远就会变得越模糊。使用雾化，只需要添加以下
代码

```javascript
scene.fog = new THREE.Fog(0xffffff, 0.015, 100)
```

这样就有一个白色雾化效果（0xffffff）。后面的两个参数是用来调节雾的显示，0.015 是 near（近处）属性的值，100 是 far（远处
）属性的值。通过这两个属性可以决定雾化开始和结束的地方，以及加深的程度。使用 THREE.Fog 创建的对象，雾的浓度是线性增长的
。通过通过移动摄像头可以看出雾化效果，离对象越近越清晰。

还有一种指数增长的雾化方法：

```javascript
scene.fog = new THREE.FogExp2(0xffffff, 0.01)
```

在这个方法中不再指定 near 和 far 属性，只需要设置雾的颜色（0xffffff）和浓度（0.01）即可。

##### 2.1.3 使用 overrideMaterial 属性

设置了 overrideMaterial 属性后，场景中所有的物体都会使用该属性指向的材质，即使物体本身也设置了材质。当某一个场景中所有物
体都共享同一个材质时，使用该属性可以通过减少 Three.js 管理的材质数量来提高运行效率，但是实际应用中，该属性通常并不非常实
用。该属性的使用方法如下所示：

```javascript
scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
```

进行了上述设置就会发现，以前给 cube 设置的随机颜色就会失效，统一为白色材质。

#### 2.2 几何体和网格

回顾之前创建几何体的操作：

```js
const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff, wireframe: true })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
```

我们使用 THREE.SphereGeometry 定义了物体的形状、使用 THREE.MeshBasicMaterial 定义了物体的外观和材质，并将它们合并成能够
添加到场景中的网格（THREE.Mesh）。

##### 2.2.1 几何体的属性和方法

之前我们创建几何体，使用 Three.js 中提供的构造函数创建的。这种方法实际上简化了操作，例如上面的球体创建，使用了三个参数，
第一个是半径，第二个是水平分段数，第三个是垂直分段数。

后面两个参数看不懂？没关系，下面解释一下。

下面是官网上给出的球绘制结果，可以看到上面有很多线。其实几何体的绘制可以看作点和面的结合，就如图所示，绘制球体只需要根据
圆心位置，半径，水平等分段数，还有垂直等分段数，计算出一个个点，再将点到点构成的面全部绘制出来即可。图中还有很多斜线，因
为这里绘制面使用的不是四边形，而是由三角形合成的。

> Tips: 到底是使用四边形还是三角形来创建面，在三维建模领域里一直存在比较大的争议。基本上，大家都习惯于用四边形来创建面，
> 因为它比三角形更容易增强和平滑。但是对于渲染器和游戏引擎来说，使用三角形更加容易，因为三角形渲染起来效率更高。

在 Three.js 中也提供了通过点和面来创建几何体的方法（原文中的方法，使用 THREE.Face3，当前已被废弃，这里使
用[迁移](https://sbcode.net/threejs/geometry-to-buffergeometry/#threegeometry_2)后的方法）：

这本书使用的版本真是太老了，很多 API 和概念都经过了多次修改，有时候还不如学新的有用

```js
// 点集合
const vertices = [
  new THREE.Vector3(1, 3, 1),
  new THREE.Vector3(1, 3, -1),
  new THREE.Vector3(1, -1, 1),
  new THREE.Vector3(1, -1, -1),
  new THREE.Vector3(-1, 3, -1),
  new THREE.Vector3(-1, 3, 1),
  new THREE.Vector3(-1, -1, -1),
  new THREE.Vector3(-1, -1, 1)
]
// 三个点代表一个面
const points = [
  vertices[0],
  vertices[2],
  vertices[1],

  vertices[2],
  vertices[3],
  vertices[1],

  vertices[4],
  vertices[6],
  vertices[5],

  vertices[6],
  vertices[7],
  vertices[5],

  vertices[4],
  vertices[5],
  vertices[1],

  vertices[5],
  vertices[0],
  vertices[1],

  vertices[7],
  vertices[6],
  vertices[2],

  vertices[6],
  vertices[3],
  vertices[2],

  vertices[5],
  vertices[7],
  vertices[0],

  vertices[7],
  vertices[2],
  vertices[0],

  vertices[1],
  vertices[3],
  vertices[4],

  vertices[3],
  vertices[6],
  vertices[4]
]
// THREE.Geometry 现在变成 THREE.BufferGeometry
const geometry = new THREE.BufferGeometry()
geometry.setFromPoints(points)
geometry.computeVertexNormals()

const materials = [
  new THREE.MeshLambertMaterial({
    opacity: 0.6,
    color: 0x44ff44,
    transparent: true
  }),
  new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
]
// createMultiMaterialObject 会根据传入的 materials，生成对应的多个 geometry
const mesh = SceneUtils.createMultiMaterialObject(geometry, materials)
// 需要对 mesh 中生成的每个 geometry 进行设置
mesh.children.forEach(function (e) {
  e.castShadow = true
})

scene.add(mesh)
```

接下来是添加控制器，查看修改坐标的效果：

```js
// 首先将 points 变成一个生成器
const generator = vertices => [
  vertices[0],
  vertices[2],
  vertices[1],

  vertices[2],
  vertices[3],
  vertices[1],

  vertices[4],
  vertices[6],
  vertices[5],

  vertices[6],
  vertices[7],
  vertices[5],

  vertices[4],
  vertices[5],
  vertices[1],

  vertices[5],
  vertices[0],
  vertices[1],

  vertices[7],
  vertices[6],
  vertices[2],

  vertices[6],
  vertices[3],
  vertices[2],

  vertices[5],
  vertices[7],
  vertices[0],

  vertices[7],
  vertices[2],
  vertices[0],

  vertices[1],
  vertices[3],
  vertices[4],

  vertices[3],
  vertices[6],
  vertices[4]
]

// 生成每个控制器，限制 range
function addControl(x, y, z) {
  const controls = new (function () {
    this.x = x
    this.y = y
    this.z = z
  })()

  return controls
}
// 生成多个控制器
const controlPoints = []
controlPoints.push(addControl(3, 5, 3))
controlPoints.push(addControl(3, 5, 0))
controlPoints.push(addControl(3, 0, 3))
controlPoints.push(addControl(3, 0, 0))
controlPoints.push(addControl(0, 5, 0))
controlPoints.push(addControl(0, 5, 3))
controlPoints.push(addControl(0, 0, 0))
controlPoints.push(addControl(0, 0, 3))

const gui = new dat.GUI()
gui.add(
  // 添加克隆功能
  new (function () {
    this.clone = function () {
      const clonedGeometry = mesh.children[0].geometry.clone()
      const materials = [
        new THREE.MeshLambertMaterial({
          opacity: 0.6,
          color: 0xff44ff,
          transparent: true
        }),
        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
      ]

      const mesh2 = SceneUtils.createMultiMaterialObject(clonedGeometry, materials)
      mesh2.children.forEach(function (e) {
        e.castShadow = true
      })

      mesh2.translateX(5)
      mesh2.translateZ(5)
      mesh2.name = 'clone'
      // 只克隆一个，需要移除旧的
      scene.remove(scene.getObjectByName('clone'))
      scene.add(mesh2)
    }
  })(),
  'clone'
)

for (let i = 0; i < 8; i++) {
  // 增加每个点的控制器
  // 这里的控制需要修改多个维度值，所以创建一个文件夹
  let f1 = gui.addFolder('Vertices ' + (i + 1))
  f1.add(controlPoints[i], 'x', -10, 10)
  f1.add(controlPoints[i], 'y', -10, 10)
  f1.add(controlPoints[i], 'z', -10, 10)
}

function render() {
  trackballControls.update()
  // 每次更新重新计算 points
  const vertices = []
  for (let i = 0; i < 8; i++) {
    vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z))
  }

  mesh.children.forEach(function (e) {
    // 重新计算 points
    e.geometry.setFromPoints(generator(vertices))
    //   e.geometry.needsUpdate = true;
    //   e.geometry.attributes.position.needsUpdate = true;
    // 根据点重新计算面（不确定是否需要，Three.js 官网文档真是太简单了）
    e.geometry.computeVertexNormals()
  })

  // render using requestAnimationFrame
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
```

##### 网格对象的属性和方法

创建网格需要几何体，材质，创建后可以将网格添加至场景渲染。网格对象提供几个属性，可以改变网格的位置和现实效果：

> position: 决定了网格相对父元素的定位
>
> rotation: 可以设置旋转效果，也可以单独旋转 X，Y，Z 轴，对应 rotateX，rotateY，rotateZ 方法
>
> scale: 设置缩放关系
>
> tranlateX，tranlateY，tranlateZ: 设置相对于当前的偏移距离
>
> visible: 设置对象的显示，隐藏效果

e.g :

```js
const controls = new (function () {
  this.scaleX = 1
  this.scaleY = 1
  this.scaleZ = 1

  this.positionX = 0
  this.positionY = 4
  this.positionZ = 0

  this.rotationX = 0
  this.rotationY = 0
  this.rotationZ = 0
  this.scale = 1

  this.translateX = 0
  this.translateY = 0
  this.translateZ = 0

  this.visible = true
  // translate 方法，点击后进行偏移
  // 偏移相对于当前位置
  // 每次触发都会继续移动
  this.translate = function () {
    cube.translateX(controls.translateX)
    cube.translateY(controls.translateY)
    cube.translateZ(controls.translateZ)

    controls.positionX = cube.position.x
    controls.positionY = cube.position.y
    controls.positionZ = cube.position.z
  }
})()

const material = new THREE.MeshLambertMaterial({ color: 0x44ff44 })
const geom = new THREE.BoxGeometry(5, 8, 3)
const cube = new THREE.Mesh(geom, material)
cube.position.y = 4
cube.castShadow = true
scene.add(cube)

const gui = new dat.GUI()

const guiScale = gui.addFolder('scale')
guiScale.add(controls, 'scaleX', 0, 5)
guiScale.add(controls, 'scaleY', 0, 5)
guiScale.add(controls, 'scaleZ', 0, 5)

const guiPosition = gui.addFolder('position')
const contX = guiPosition.add(controls, 'positionX', -10, 10)
const contY = guiPosition.add(controls, 'positionY', -4, 20)
const contZ = guiPosition.add(controls, 'positionZ', -10, 10)
// 增加位置修改的监听
contX.listen()
contX.onChange(function (value) {
  cube.position.x = controls.positionX
})

contY.listen()
contY.onChange(function (value) {
  cube.position.y = controls.positionY
})

contZ.listen()
contZ.onChange(function (value) {
  cube.position.z = controls.positionZ
})

const guiRotation = gui.addFolder('rotation')
guiRotation.add(controls, 'rotationX', -4, 4)
guiRotation.add(controls, 'rotationY', -4, 4)
guiRotation.add(controls, 'rotationZ', -4, 4)

const guiTranslate = gui.addFolder('translate')

guiTranslate.add(controls, 'translateX', -10, 10)
guiTranslate.add(controls, 'translateY', -10, 10)
guiTranslate.add(controls, 'translateZ', -10, 10)
guiTranslate.add(controls, 'translate')

gui.add(controls, 'visible')

render()

function render() {
  // 设置对象是否可以
  cube.visible = controls.visible
  // 设置旋转效果
  cube.rotation.x = controls.rotationX
  cube.rotation.y = controls.rotationY
  cube.rotation.z = controls.rotationZ
  // 设置缩放效果
  cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ)

  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
```

#### 2.3 摄像机

Three.js 提供了一些摄像机，这里常用的就是正交投影摄像机（OrthographicCamera），和透视投影摄像机（PerspectiveCamera）。除
此之外，还有立体摄像机，用作 Vr 或者其他特殊的 3D 图形。

##### 2.3.1 正交投影摄像机和透视投影摄像机

透视视图下，距离摄像机越远，对象就会被渲染得越小。

正交视图下，所有的对象被渲染出来的是不会根据摄像机的距离做调整的。

两种摄像机，构造函数使用的参数也不同。

首先介绍 PerspectiveCamera：

> PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
>
> fov — Camera frustum vertical field of view. aspect — Camera frustum aspect ratio. near — Camera frustum near plane.
> far — Camera frustum far plane.

上面是官网的信息，书中也有介绍：

- fov 代表视场，就是摄像机能看到的那部分场景。比如，人类有近 180 度的视场。但是计算机不能完全展示人眼能看到的景象，对于
  游戏而言，视场一般在 60 度到 90 度，推荐默认值：50
- aspect 代表长宽比，就是渲染页面的横向尺寸和纵向尺寸。推荐默认值：window.innerWidth/window.innerHeight。
- near 代表近面距离，定义了从距离摄像机多近距离开始渲染。通常这个值要设置的尽量小，从而使得所有物体都能看到。推荐默认值
  ：0.1。
- far 代表远面距离，定义了摄像机从它的位置能够看多远。如果值过小，就会导致场景渲染不全，过大，会影响渲染性能。推荐默认值
  ：1000。
- zoom 代表变焦（官网上构造函数已经移除这个参数，但是可以调用 zoom 方法），使用 zoom 可以放大缩小场景，如果值小于 1，场
  景会缩小，高于 1 会被放大。如果是负数，场景会上下颠倒。推荐默认值：1。

接下来是 OrthographicCamera，如果要配置正交投影摄像机，我们需要使用其他的一些属性。由于正交投影摄像机渲染出的物体大小都
是一样的，所以它并不关心使用什么长宽比，或者以什么样的视角来观察场景。当使用正交投影摄像机时，你要定义的是一个需要被渲染
的方块区域

> ### OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )
>
> left — Camera frustum left plane. right — Camera frustum right plane. top — Camera frustum top plane. bottom — Camera
> frustum bottom plane. near — Camera frustum near plane. far — Camera frustum far plane.

- left 代表左边界
- right 代表右边界
- top 上边界
- bottom 下边界
- near 近面距离，渲染场景的起点
- far 远面距离，渲染场景结束点
- zoom 和 PerspectiveCamera 的 zoom 一样

##### 2.3.2 将摄像机聚焦在指定点上 2.3.2 将摄像机聚焦在指定点上

通常来说，摄像机会指向场景的中心，用坐标来表示就是 position(0，0，0)。但是我们可以很容易地改变摄像机所指向的位置，代码如
下所示：

```js
camera.lookAt(new THREE.Vector(x, y, z))
```

## 3 Three.js 中的光源

没有光源，渲染的场景将不可见（除非你使用基础材质或线框材质）。Three.js 中包含大量的光源，每一个光源都有特别的用法。

#### 3.1 Three.js 中不同种类的光源

> AmbientLight：基本光源，就是环境光，光源的颜色会均匀地洒在场景所有的物体上
>
> PointLight：点光源，从空间一点向所有方向发射光，点光源不能用来创建阴影
>
> SpotLight：聚光灯，就类似现实中舞台上那种聚光灯的效果，这种光源可以创建阴影
>
> DirectionalLight：平行光源，类似太阳光，从无限远来，每道光都可以看作平行的。一般用来模拟日光，可以创造阴影。
>
> HemisphereLight：`A light source positioned directly above the scene, with color fading from the sky color to the ground color.This light cannot be used to cast shadows.`光
> 源通过模拟反光面和光线微弱的天空，来创建更加自然的室外光线。不产生阴影。
>
> RectAreaLight（书上是 AreaLight）：RectAreaLight emits light uniformly across the face a rectangular plane. This light
> type can be used to simulate light sources such as bright windows or strip lighting（日光灯）.
>
> LensFlare：不是光源，但是可以通过 LensFlare，可以为场景中光源添加镜头光晕效果。

#### 3.2 基础光源

##### 3.2.1 THREE.AmbientLight

在创建 THREE.AmbientLight 时，颜色将会应用到全局。该光源并没有特别的来源方向，并且 THREE.AmbientLight 不会生成阴影。通常
，不能将 THREE.AmbientLight 作为场景中唯一的光源，因为它会将场景中的所有物体渲染为相同的颜色，而不管是什么形状。在使用其
他光源（如 THREE.SpotLight 或 THREE.DirectionalLight）的同时使用它，目的是弱化阴影或给场景添加一些额外的颜色。

构造函数：

AmbientLight( color : Integer, intensity : Float )

color - (optional) Numeric value of the RGB component of the color. Default is 0xffffff. intensity - (optional) Numeric
value of the light's strength/intensity. Default is 1.

在第一个例子中添加以下代码：

```js
// 添加光源
const ambiColor = '#0c0c0c'
const ambientLight = new THREE.AmbientLight(ambiColor)
scene.add(ambientLight)

// controls 里面添加其他属性
const controls = new (function () {
  this.rotationSpeed = 0.02
  this.bouncingSpeed = 0.03
  this.intensity = ambientLight.intensity // 光强
  this.ambientColor = ambiColor // 光的颜色
  this.disableSpotlight = false // 是否关闭 spotLight
})()

// gui 添加控制项，使用 onChange 增加监听回调
gui.add(controls, 'intensity', 0, 3, 0.1).onChange(function (e) {
  ambientLight.intensity = e
})
// addColor 会增加一个颜色选择器
gui.addColor(controls, 'ambientColor').onChange(function (e) {
  ambientLight.color = new THREE.Color(e) // ambientLight 中的 color 属性是 THREE.Color 转换后的结果
  // color 是 THREE.Color 的实例，最直观的就是可以通过调用 THREE.Color 的方法来实现修改颜色
  // ambientLight.color.setStyle(e);
})
gui.add(controls, 'disableSpotlight').onChange(function (e) {
  spotLight.visible = !e
})
```

从效果上看，关闭 spotLight 后，阴影效果消失了。ambientLight 确实不产生阴影，修改 ambientLight 的颜色和强度，会改变阴影的
表现效果。

##### 3.2.2 THREE.SpotLight

THREE.SpotLight（聚光灯光源）是最常使用的光源之一（特别是如果你想要使用阴影的话）。THREE.SpotLight 是一种具有锥形效果的
光源。你可以把它与手电筒或灯塔产生的光进行对比。该光源产生的光具有方向和角度。

构造函数：

SpotLight( color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float )

color - (optional) hexadecimal color of the light. Default is 0xffffff (white). intensity - (optional) numeric value of
the light's strength/intensity. Default is 1. distance - Maximum range of the light. Default is 0 (no limit). angle -
Maximum angle of light dispersion from its direction whose upper bound is Math.PI/2. penumbra - Percent of the spotlight
cone that is attenuated due to penumbra. Takes values between zero and 1. Default is zero. decay - The amount the light
dims along the distance of the light.

实例属性：

> angle：角度，单位是弧度，默认 Math.PI/3
>
> castShadow：是否显示阴影，默认 false
>
> color：光源颜色
>
> decay：衰减，光强随着离开光源的衰减速度，默认值是 2，也是接近最接近现实世界效果的值
>
> distance：距离，光源照射的距离，默认是 0，在默认模式和物理正确模式下，设置不同的值会有不同的效果。默认模式下，设置 0，
> 光源将不会衰减。如果不是 0，光源将从起始位置到设置的距离上，进行线性减少。物理正确模式下，设置 0，光源将遵循平方反比的
> 规律（inverse-square law），从光源到无穷远进行衰减。如果设置有值，则将同样遵循平方反比，从起始位置到设定值间进行衰减。
>
> intensity：光强，默认是 1
>
> penumbra：半影区，设置聚光灯锥形照明区域在其边缘附近的平滑衰减速度，取值 0 到 1，默认是 0
>
> position：光源位置
>
> power：物理正确模式启用，可以使用这个属性指定光源功率，单位流明，4\*Math.PI
>
> target：光源指向的方向，默认位置 (0, 0, 0)，修改 target 后，需要手动调用 `scene.add( light.target );` 更新。target 也
> 可以是一个包含位置信息的 THREE.Object3D 对象，这样 spotLight 会自动追踪这个对象。
>
> visible：是否可见，默认为 true，设置 false 会关闭。

##### 3.2.3 THREE.PointLight

Three.js 库中的 THREE.PointLight（点光源）是一种单点发光、照射所有方向的光源。夜空中的照明弹就是一个很好的点光源的例子。

例子 1 中添加如下代码：

```js
const pointColor = '#ccffcc'
const pointLight = new THREE.PointLight(pointColor)
pointLight.distance = 100
scene.add(pointLight)

// add a small sphere simulating the pointlight
const sphereLight = new THREE.SphereGeometry(0.2)
const sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 })
const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial)
sphereLightMesh.castShadow = true

sphereLightMesh.position.set(3, 0, 3)
scene.add(sphereLightMesh)

// used to determine the switch point for the light animation
let invert = 1
let phase = 0

function renderScene() {
  if (phase > 2 * Math.PI) {
    invert = invert * -1
    phase -= 2 * Math.PI
  } else {
    phase += controls.rotationSpeed
  }

  sphereLightMesh.position.z = +(7 * Math.sin(phase))
  sphereLightMesh.position.x = +(14 * Math.cos(phase))
  sphereLightMesh.position.y = 5

  if (invert < 0) {
    const pivot = 14
    sphereLightMesh.position.x = invert * (sphereLightMesh.position.x - pivot) + pivot
  }

  pointLight.position.copy(sphereLightMesh.position)
  requestAnimationFrame(renderScene)
  renderer.render(scene, camera)
}
```

可以看到点光源经过时，会将几何体表面照亮。

##### 3.2.4 THREE.DirectionalLight

最后一个基本光源是 THREE.DirectionalLight（平行光）。这种类型的光可以看作是距离很远的光。它发出的所有光线都是相互平行的
。平行光的一个范例就是太阳光。太阳是如此遥远，以至于到达地球时所有的光线（几乎）都是相互平行的。THREE.DirectionalLight
和我们之前看过的 THREE.SpotLight 之间的主要区别是：平行光不像聚光灯（可以通过 distance 等属性来微调）那样离目标越远越暗
淡。被平行光照亮的整个区域接收到的光强是一样的。

DirectionalLight( color : Integer, intensity : Float )

color - (optional) hexadecimal color of the light. Default is 0xffffff (white). intensity - (optional) numeric value of
the light's strength/intensity. Default is 1.

添加方式很简单：

```js
const pointColor = '#ff5808'
const directionalLight = new THREE.DirectionalLight(pointColor)
directionalLight.position.set(-40, 60, -10) // 光源位置
directionalLight.castShadow = true // 可以生成阴影

directionalLight.shadowMapHeight = 1024
directionalLight.shadowMapWidth = 1024

scene.add(directionalLight)
```

#### 3.3 特殊光源

两个特殊光源，首先是 THREE.HemisphereLight（半球光光源），这种光源可以为户外场景创建更加自然的光照效果。然后是
THREE.RectAreaLight（区域光光源），它可以从一个很大的区域发射光线，而不是从单个点。最后，会展示一下如何在场景中添加镜头
光晕的效果。

##### 3.3.1 THREE.HemisphereLight

使用 THREE.Hemisphere Light，可以创建出更加贴近自然的户外光照效果。如果不使用这个灯光，要模拟户外光照，可以创建一个
THREE.DirectionalLight 来模拟太阳光，并且可能再添加一个 THREE.AmbientLight 来为场景提供基础色。但是，这样的光照效果看起
来并不怎么自然。在户外，并不是所有的光照都来自上方：很多是来自于大气的散射和地面以及其他物体的反射。Three.js 中的
THREE.HemisphereLight 光源就是为这种情形创建的。它为获得更自然的户外光照效果提供了一种简单的方式。

```js
const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6)
hemiLight.position.set(0, 500, 0)
scene.add(hemiLight)
```

HemisphereLight( skyColor : Integer, groundColor : Integer, intensity : Float )

skyColor - (optional) hexadecimal color of the sky. Default is 0xffffff. groundColor - (optional) hexadecimal color of
the ground. Default is 0xffffff. intensity - (optional) numeric value of the light's strength/intensity. Default is 1.

##### 3.3.2 THREE.RectAreaLight

RectAreaLight( color : Integer, intensity : Float, width : Float, height : Float )

color - (optional) hexadecimal color of the light. Default is 0xffffff (white). intensity - (optional) the light's
intensity, or brightness. Default is 1. width - (optional) width of the light. Default is 10. height - (optional) height
of the light. Default is 10.

这个部分是我最迷糊的地方，原文中使用的是 `THREE.AreaLight`，这个 API 早就被移除了。现在使用的应该是
`THREE.RectAreaLight`。同时提供的示例代码跑起来，没有得到预期的效果，代码中使用 `THREE.WebGLDeferredRenderer` 也是被移除
了。这里我也没有深究，光源现实出来就没管了。后续有了更深的了解，再自己把这部分内容补上吧。

```js
const areaLight1 = new THREE.RectAreaLight(0xff0000, 3)
areaLight1.position.set(-10, 10, -35)
areaLight1.rotation.set(-Math.PI / 2, 0, 0)
areaLight1.width = 4
areaLight1.height = 9.9
scene.add(areaLight1)

const planeGeometry1 = new THREE.BoxGeometry(4, 10, 0)
const planeGeometry1Mat = new THREE.MeshBasicMaterial({
  color: 0xff0000
})
let plane1 = new THREE.Mesh(planeGeometry1, planeGeometry1Mat)
plane1.position.copy(areaLight1.position)
scene.add(plane1)
```

上述代码创建了一个新的 THREE.RectAreaLight 对象。这个光源的颜色为 0xff0000，光强的值为 500，width 就 4，height 是 10。与
其他光源一样，可以使用 position 属性设置该光源在场景中的位置。在创建 THREE.AreaLight 时，会创建出一个垂直平面。在这个示
例中，创建了三个 THREE.AreaLight 对象，有不同的颜色。当你第一次尝试该光源的时候，可能会觉得奇怪：为什么在你放置光源的地
方什么都看不到？这是因为你不能看到光源本身，而只能看到它发射出的光，而且只有当这些光照射到某个物体上时才能看到。如果你想
创建出例子中所展示的场景，可以在相同的位置（areaLight1.position）增加 THREE.PlaneGeometry 或 THREE.BoxGeometry 对象来模
拟光线照射的区域。

##### 3.3.3 镜头光晕

最后一个主题是镜头光晕（lens flare），当你直接朝着太阳或另一个非常明亮的光源拍照时就会出现镜头光晕效果。在大多数情况下，
需要避免出现这种情形，但是对于游戏和三维图像来说，它提供了一种很好的效果，让场景看上去更加真实。Three.js 库也支持镜头光
晕，而且在场景中添加它非常简单。

LensflareElement( texture : [Texture](https://threejs.org/docs/index.html#api/en/textures/Texture), size : Float,
distance : Float, color : [Color](https://threejs.org/docs/index.html#api/en/math/Color) )

[texture](https://threejs.org/docs/index.html#api/en/textures/Texture) - THREE.Texture to use for the flare. size -
(optional) size in pixels distance - (optional) (0-1) from light source (0 = at light source)
[color](https://threejs.org/docs/index.html#api/en/math/Color) - (optional) the
[Color](https://threejs.org/docs/index.html#api/en/math/Color) of the lens flare

```js
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'

const textureLoader = new THREE.TextureLoader()

const textureFlare0 = textureLoader.load(Texture0)
const textureFlare3 = textureLoader.load(Texture3)

const lensflare = new Lensflare()

lensflare.addElement(new LensflareElement(textureFlare0, 512, 0))
lensflare.addElement(new LensflareElement(textureFlare3, 512, 0))
lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6))

spotLight.add(lensflare)
```

书上讲的方法，已经不行了（这句话不知道要重复多少遍），上述代码是我从官网 copy，修改后的。

官网上没有 Lensflare 的 construtor 参数，示例是也没有加参数，LensflareElement 的参数上面已经写了，这里记录下书上写的
Lensflare 对应参数吧。

> texture：纹理，纹理就是一个图片，用来决定光晕形状
>
> size：光晕尺寸，单位是像素，如果是 -1，将会使用纹理本身大小
>
> distance：距离，从光源（0）到摄像机（1），这是光晕的位置
>
> blending：混合（官网上没有看到），默认混合方式是 THREE.AdditiveBlending
>
> color：光晕颜色
>
> opacity：不透明度

## 4 使用 Three.js 的材质

一个材质结合 THREE.Geometry 对象，可以构成 THREE.Mesh 对象。材质就像物体的皮肤，决定了几何体的外表。例如，皮肤定义了一个
几何体看起来是否像金属、透明与否，或者显示为线框。然后得到的 THREE.Mesh 对象才可以添加到 Three.js 渲染的场景中。
