<!-- Original by: https://github.com/ValentinH/svelte-easy-crop -->
<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte'
	import * as helpers from './helpers'

	export let image
	//export let crop = { x: 0, y: 0 }
	export let zoom = 1
	export let aspect = 1 / 1
	export let minZoom = 1
	export let maxZoom = 3
	export let cropSize = null
	export let cropShape = 'rect'
	export let showGrid = true
	export let zoomSpeed = 1
	export let crossOrigin = null
	export let restrictPosition = true


  function getCrop() : {x:number, y:number}
  {
    return _crop;
  }
  function setCrop(crop:{x:number, y:number})
  {
    if (!crop)
      debugger;

    if (Math.abs(crop.x - _crop.x) > 50 || Math.abs(crop.y - _crop.y) > 50)
    {
      console.log("Moved 50 px left or right")
    }

    _crop = crop
    console.log("new crop:", _crop)
  }
  let _crop:{x:number, y:number} = {x:0, y:0};

	let cropperSize = null
	let imageSize = { width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 }
  let containerEl = null
  let cropperEl = null
	let containerRect = null
	let imgEl = null
	let dragStartPosition = { x: 0, y: 0 }
	let dragStartCrop = { x: 0, y: 0 }
	let lastPinchDistance = 0
	let rafDragTimeout = null
	let rafZoomTimeout = null

	const dispatch = createEventDispatcher()

	onMount(() => {
	  window.addEventListener('resize', computeSizes)
	  containerEl.addEventListener('wheel', onWheel, { passive: false })
	  containerEl.addEventListener('gesturestart', preventZoomSafari)
	  containerEl.addEventListener('gesturechange', preventZoomSafari)

	  // when rendered via SSR, the image can already be loaded and its onLoad callback will never be called
	  if (imgEl && imgEl.complete) {
	    onImgLoad()
	  }
	})

	onDestroy(() => {
	  window.removeEventListener('resize', computeSizes)
	  containerEl.removeEventListener('wheel', onWheel)
	  containerEl.removeEventListener('gesturestart', preventZoomSafari)
	  containerEl.removeEventListener('gesturechange', preventZoomSafari)
	  cleanEvents()
	})

	// this is to prevent Safari on iOS >= 10 to zoom the page
	const preventZoomSafari = e => e.preventDefault()

	const cleanEvents = () => {
	  document.removeEventListener('mousemove', onMouseMove)
	  document.removeEventListener('mouseup', onDragStopped)
	  document.removeEventListener('touchmove', onTouchMove)
	  document.removeEventListener('touchend', onDragStopped)
	}

	const onImgLoad = () => {
	  computeSizes()
    centerImage()
	  emitCropData()
	}

	const getAspect = () => {
	  if (cropSize) {
	    return cropSize.width / cropSize.height
	  }
	  return aspect
	}

	const computeSizes = () => {
	  if (imgEl) {
	    imageSize = {
	      width: imgEl.width,
	      height: imgEl.height,
	      naturalWidth: imgEl.naturalWidth,
	      naturalHeight: imgEl.naturalHeight,
	    }
	    cropperSize = cropSize ? cropSize : helpers.getCropSize(imgEl.width, imgEl.height, aspect)
	  }
	  if (containerEl) {
	    containerRect = containerEl.getBoundingClientRect()
	  }
	}

  const centerImage = () => {
	  const imageCenter = {
	    x: imageSize.width / 2,
      y: imageSize.height / 2
    }
    const containerCenter = {
      x: containerRect.width / 2,
      y: containerRect.height / 2,
    }
    const translation = {
      x: imageCenter.x - containerCenter.x,
      y: imageCenter.y - containerCenter.y
    }
    const c = {
	    x: -translation.x,
      y: -translation.y
    }
    setCrop(c);
  }

	const getMousePoint = e => ({ x: Number(e.clientX), y: Number(e.clientY) })

	const getTouchPoint = touch => ({
	  x: Number(touch.clientX),
	  y: Number(touch.clientY),
	})

	const onMouseDown = e => {
	  e.preventDefault()
	  document.addEventListener('mousemove', onMouseMove)
	  document.addEventListener('mouseup', onDragStopped)
	  onDragStart(getMousePoint(e))
	}

	const onMouseMove = e => onDrag(getMousePoint(e))

	const onTouchStart = e => {
	  e.preventDefault()
	  document.addEventListener('touchmove', onTouchMove, { passive: false }) // iOS 11 now defaults to passive: true
	  document.addEventListener('touchend', onDragStopped)
	  if (e.touches.length === 2) {
	    onPinchStart(e)
	  } else if (e.touches.length === 1) {
	    onDragStart(getTouchPoint(e.touches[0]))
	  }
	}

	const onTouchMove = e => {
	  // Prevent whole page from scrolling on iOS.
	  e.preventDefault()
	  if (e.touches.length === 2) {
	    onPinchMove(e)
	  } else if (e.touches.length === 1) {
	    onDrag(getTouchPoint(e.touches[0]))
	  }
	}

	const onDragStart = ({ x, y }) => {
	  dragStartPosition = { x, y }
	  dragStartCrop = getCrop();
	}

	let lastOffset = {
	  x: 0,
    y: 0
  }

  function getImgElementBounds() {
    let imageBoundsOrig = imgEl.getBoundingClientRect();
    let imageBounds = {
      x: imageBoundsOrig.x - containerRect.x,
      y: imageBoundsOrig.y - containerRect.y,
      r: imageBoundsOrig.x - containerRect.x + imageBoundsOrig.width,
      b: imageBoundsOrig.y - containerRect.y + imageBoundsOrig.height,
      w: imageBoundsOrig.width,
      h: imageBoundsOrig.height
    }
    return imageBounds;
  }

  function getCropperElementBounds() {
    let cropperBounds = cropperEl.getBoundingClientRect();
    cropperBounds = {
      x: cropperBounds.x - containerRect.x,
      y: cropperBounds.y - containerRect.y,
      r: cropperBounds.x - containerRect.x + cropperBounds.width,
      b: cropperBounds.y - containerRect.y + cropperBounds.height,
      w: cropperBounds.width,
      h: cropperBounds.height
    }
    return cropperBounds;
  }

  function fence(requestedImagePosition:{x:number, y:number})
  {
    const imageBounds = getImgElementBounds();
    const cropperBounds = getCropperElementBounds();
    const fence = {
      x:0,
      y:0
    }

    const tooFarLeft = cropperBounds.r - (requestedImagePosition.x + imageBounds.w);
    if (tooFarLeft > 0) {
      fence.x = tooFarLeft
      console.log("tooFarLeft", tooFarLeft)
    }

    const tooFarRight = cropperBounds.x - requestedImagePosition.x;
    if (tooFarRight < 0) {
      fence.x = tooFarRight
      console.log("tooFarRight", tooFarRight)
    }

    const tooFarUp = cropperBounds.b - (requestedImagePosition.y + imageBounds.h);
    if (tooFarUp > 0) {
      fence.y =  tooFarUp
      console.log("tooFarUp", tooFarUp)
    }

    const tooFarDown = cropperBounds.y - requestedImagePosition.y;
    if (tooFarDown < 0) {
      fence.y = tooFarDown
      console.log("tooFarDown", tooFarDown)
    }

    return fence;
  }

  const onDrag = ({ x, y }) => {
	  if (rafDragTimeout) window.cancelAnimationFrame(rafDragTimeout)

	  rafDragTimeout = window.requestAnimationFrame(() =>
    {
      if (x === undefined || y === undefined) {
        return
      }

      const offsetX = x - dragStartPosition.x
      const offsetY = y - dragStartPosition.y
      const requestedPosition = {
        x: dragStartCrop.x + offsetX,
        y: dragStartCrop.y + offsetY,
      }

      const imageBounds = getImgElementBounds();
      const requestedImagePosition = {
        x: imageBounds.x + requestedPosition.x,
        y: imageBounds.y + requestedPosition.y,
      }

      const fencedTranslation = fence(requestedImagePosition);
      const c = getCrop();
      setCrop({
        x: c.x + offsetX - lastOffset.x + fencedTranslation.x,
        y: c.y + offsetY - lastOffset.y + fencedTranslation.y
      });

      lastOffset = {
        x: offsetX,
        y: offsetY
      }
	  })
	}

	const onDragStopped = () => {
	  cleanEvents()
	  emitCropData()
	}

	const onPinchStart = e => {
	  const pointA = getTouchPoint(e.touches[0])
	  const pointB = getTouchPoint(e.touches[1])
	  lastPinchDistance = helpers.getDistanceBetweenPoints(pointA, pointB)
	  onDragStart(helpers.getCenter(pointA, pointB))
	}

	const onPinchMove = e => {
	  const pointA = getTouchPoint(e.touches[0])
	  const pointB = getTouchPoint(e.touches[1])
	  const center = helpers.getCenter(pointA, pointB)
	  onDrag(center)

	  if (rafZoomTimeout) window.cancelAnimationFrame(rafZoomTimeout)
	  rafZoomTimeout = window.requestAnimationFrame(() => {
	    const distance = helpers.getDistanceBetweenPoints(pointA, pointB)
	    const newZoom = zoom * (distance / lastPinchDistance)
	    setNewZoom(newZoom, center)
	    lastPinchDistance = distance
	  })
	}

	const onWheel = e => {
	  e.preventDefault()
	  const point = getMousePoint(e)
	  const newZoom = zoom - (e.deltaY * zoomSpeed) / 200
	  setNewZoom(newZoom, point)
	}

	const getPointOnContainer = ({ x, y }) => {
	  if (!containerRect) {
	    throw new Error('The Cropper is not mounted')
	  }
	  return {
	    x: containerRect.width / 2 - (x - containerRect.left),
	    y: containerRect.height / 2 - (y - containerRect.top),
	  }
	}

	const getPointOnImage = ({ x, y }) =>
  {
    {
      const c = getCrop();
      return {
        x: (x + c.x) / zoom,
        y: (y + c.y) / zoom,
      }
    }
  }

	const setNewZoom = (newZoom, point) => {
	  const zoomPoint = getPointOnContainer(point)
	  const zoomTarget = getPointOnImage(zoomPoint)
	  zoom = Math.min(maxZoom, Math.max(newZoom, minZoom))

	  const r = {
	    x: zoomTarget.x * zoom - zoomPoint.x,
	    y: zoomTarget.y * zoom - zoomPoint.y,
	  }

    const imageBounds = getImgElementBounds();
    const requestedImagePosition = {
      x: imageBounds.x + r.x,
      y: imageBounds.y + r.y,
    }
    const fencedTranslation = fence(requestedImagePosition);
    const c = getCrop();
    setCrop({
      x: c.x + r.x - lastOffset.x + fencedTranslation.x,
      y: c.y + r.y - lastOffset.y + fencedTranslation.y
    });
    lastOffset = {
      x: 0,
      y: 0
    }
    /*
	  const c = restrictPosition
	    ? helpers.restrictPosition(requestedPosition, imageSize, cropperSize, zoom)
	    : requestedPosition

    setCrop(c);
    */
	}

	const emitCropData = () => {
	  if (!cropperSize || cropperSize.width === 0) return

    const c = getCrop();
	  // this is to ensure the crop is correctly restricted after a zoom back (https://github.com/ricardo-ch/svelte-easy-crop/issues/6)
	  const position = restrictPosition
	    ? helpers.restrictPosition(c, imageSize, cropperSize, zoom)
	    : c
	  const { croppedAreaPercentages, croppedAreaPixels } = helpers.computeCroppedArea(
	    position,
	    imageSize,
	    cropperSize,
	    getAspect(),
	    zoom,
	    restrictPosition
	  )

	  dispatch('cropcomplete', {
	    percent: croppedAreaPercentages,
	    pixels: croppedAreaPixels,
	  })
	}

	// ------ Reactive statement ------

	//when aspect changes, we reset the cropperSize
	$: if (imgEl) {
	  cropperSize = cropSize ? cropSize : helpers.getCropSize(imgEl.width, imgEl.height, aspect)
	}

	// when zoom changes, we recompute the cropped area
	$: zoom && emitCropData()
</script>

<style>
  .container {
    width:100%;
    height:100%;
    overflow: hidden;
    user-select: none;
    touch-action: none;
    cursor: move;
  }

  .image {
    width: 100%;
    height: 100%;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    will-change: transform;
  }

  .cropperArea {
    position: absolute;
    left: 50%;
    top: 50%;
    width:100%;
    height:100%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 9999em;
    /*box-sizing: border-box;*/
    color: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.5);
    overflow: hidden;
  }

  .grid:before {
    content: ' ';
    /*box-sizing: border-box;*/
    border: 1px solid rgba(255, 255, 255, 0.5);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 33.33%;
    right: 33.33%;
    border-top: 0;
    border-bottom: 0;
  }

  .grid:after {
    content: ' ';
    /*box-sizing: border-box;*/
    border: 1px solid rgba(255, 255, 255, 0.5);
    position: absolute;
    top: 33.33%;
    bottom: 33.33%;
    left: 0;
    right: 0;
    border-left: 0;
    border-right: 0;
  }

  .round {
    border-radius: 50%;
  }
</style> 

<div
	class="container"
	bind:this={containerEl}
	on:mousedown={onMouseDown}
	on:touchstart={onTouchStart}
	data-testid="container"
>
  <div class="image">
    <img
      bind:this={imgEl}
      src={image}
      on:load={onImgLoad}
      alt=""
      style="transform: translate({_crop.x}px, {_crop.y}px) scale({zoom});"
      crossorigin={crossOrigin}
    />
    {#if cropperSize}
      <div
        bind:this={cropperEl}
        class="cropperArea"
        class:round={cropShape === 'round'}
        class:grid={showGrid}
        style="width: {cropperSize.width}px; height: {cropperSize.height}px;"
        data-testid="cropper"></div>
    {/if}
  </div>
</div>
