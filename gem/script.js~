// Initialize the QR Code Scanner
const qrReader = new Html5Qrcode("qr-reader");
qrReader.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
    qrCodeMessage => {
        console.log("QR Code detected: ", qrCodeMessage);
        qrReader.stop();
        showARContent(qrCodeMessage);
    },
    error => {
        console.warn("QR Code scanning failed: ", error);
    }
);

// Load AR Scene
function showARContent(data) {
    const container = document.getElementById("ar-container");
    container.style.width = "100%";
    container.style.height = "400px";

    // Create Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Add Box and Gem
    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box);

    const gemGeometry = new THREE.OctahedronGeometry();
    const gemMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const gem = new THREE.Mesh(gemGeometry, gemMaterial);
    gem.position.set(0, 1, 0); // Above the box
    scene.add(gem);

    // Position Camera
    camera.position.z = 5;

    // Animation
    let opening = false;
    function animate() {
        requestAnimationFrame(animate);
        if (opening) {
            if (box.scale.y > 0.1) {
                box.scale.y -= 0.01;
                gem.position.y += 0.01;
            }
        }
        renderer.render(scene, camera);
    }
    animate();

    // Trigger Animation
    setTimeout(() => (opening = true), 1000);
}
