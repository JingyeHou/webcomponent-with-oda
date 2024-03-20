const odaViewerScript = document.createElement('script');
odaViewerScript.src = '/visualize/Visualize.js';
document.addEventListener('DOMContentLoaded', () => {
    // Define a function to check if the element is available in the DOM
    const checkElement = async () => {
        const myComponent = document.querySelector('my-component');
        if (myComponent && myComponent.shadowRoot) {
            // Access the shadow root
            const shadowRoot = myComponent.shadowRoot;
            document.head.appendChild(odaViewerScript);
            const loadViewerScript = new Promise((resolve) => {
                odaViewerScript.onload = () => {
                  resolve();
                };
              });
              await loadViewerScript;
            modelViewerElement = document.createElement('canvas'); 
            modelViewerElement.setAttribute('class', 'odaviewer');
            modelViewerElement.setAttribute('id', 'odaviewer');
            shadowRoot.appendChild(modelViewerElement);

            const options = {
                urlMemFile:
                  "visualize/Visualize.js.wasm",
                TOTAL_MEMORY: 134217728
              };
              const lib = getVisualizeLibInst(options);
              console.log(lib);
              lib.postRun.push(() => {
                const canvas = shadowRoot.getElementById("odaviewer");
                canvas.height = canvas.clientHeight;
                canvas.width = canvas.clientWidth;
                
                lib.canvas = canvas;
                let viewer
                try {
                    viewer = lib.Viewer.create();
                } catch (error) {
                    console.log(error);
                }

                function resize() {
                    canvas.height = canvas.clientHeight;
                    canvas.width = canvas.clientWidth;
                    viewer.resize(0, canvas.width, canvas.height, 0);
                    viewer.update();
                }
                resize();
                window.addEventListener("resize", resize);

                viewer.createLocalDatabase();
                //viewer.activeView.renderMode = lib.RenderMode.GouraudShaded;
                viewer.setEnableAnimation(false);

                const model = viewer.createModel("Model");
                const entity = model.appendEntity("Entity");
                const entityPtr = entity.openObject();

                entityPtr.setColor(255, 0, 0);

                // circle
                const circleData = { center: [0, 0, 0], radius: 10, normal: [0, 0, 1] };
                entityPtr.appendCircleWithNormal(
                    circleData.center,
                    circleData.radius,
                    circleData.normal
                );
                
                // polyline
                const polylineData = [5, 5, 0, 5, -5, 0, 0, 5, 0, 0, 5, 0, -5, -5, 0];
                const polyline = entityPtr.appendPolyline(polylineData);
                const lineType = polyline.openObject().getLinetype();
                
                lineType.setPredefinedLinetype(lib.LinetypePredefined.kDash2Dot);
                polyline.openObject().setLinetype(lineType);

                // polygon
                const polygonData = [0, 0, 0, 2, 0, 0, 2, 2, 0, 0, 2, 0];
                const polygon = entityPtr.appendPolygon(polygonData);
                polygon.openAsPolygon().setFilled(true);

                // text
                const text = entityPtr.appendText([0, 7, 0], "Example text");
                const textPtr = text.openAsText();

                textPtr.setNormal([0, 0, 1]);
                textPtr.setRotation(-0.8);
                textPtr.setTextSize(1);
                textPtr.delete();

                entityPtr.delete();

                viewer.zoomExtents();
                viewer.update();

                function render() {
                    viewer.update();
                    requestAnimationFrame(render);
                }
                render();
            });
        } else {
            // Element or shadow root not available yet, wait and check again
            setTimeout(checkElement, 100);
        }
    };

    // Initial check to see if the element is already available
    checkElement();
});