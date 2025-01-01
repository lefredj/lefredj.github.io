import { MindARThree } from "mindar-face"; // For marker-based AR

// Initialize AR Application
const initAR = async () => {
  const mindARThree = new MindARThree({
    container: document.body,
    imageTargetSrc: './targets.mind', // Predefined marker file (QR Code)
  });

  const { renderer, scene, camera } = mindARThree;

  // Add Box to Scene
  const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  scene.add(box);

  // Anchor the box to the marker
  const anchor = mindARThree.addAnchor(0);
  anchor.group.add(box);

  // Animation
  const animate = () => {
    box.rotation.y += 0.01; // Rotate box
    renderer.render(scene, camera);
  };

  // Start AR
  await mindARThree.start();
  renderer.setAnimationLoop(animate);
};

// Load AR
window.onload = () => {
  document.body.requestFullscreen();
  initAR();
};
