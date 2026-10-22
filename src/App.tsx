import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Box,
  CheckCircle2,
  HelpCircle,
  Hand,
  Layers,
  X,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

/**
 * CONCISE SUMMARY DATA — Chapitre 1 (Pages 1–53)
 * Course: Initiation à la conception (ISET Kélibia — H. Jbeli)
 */
const CHAPTERS = [
  {
    id: 'ch1',
    index: 1,
    shortTitle: "1. Logiciel & CQFD",
    title: "Notion de Logiciel & Règle CQFD",
    pages: "p. 1–7",
    accentColor: "#38bdf8",
    cameraPos: [0, 3.4, 12.2],
    formula: "Logiciel = Programmes + Documentations  |  CQFD = Coût + Qualité + Fonctionnalité + Délai",
    bullets: [
      "Un logiciel = Programmes (code/exécutables) + Documentations + Configuration (p. 3).",
      "Génie Logiciel : concevoir, fabriquer et maintenir des systèmes complexes en équipe (p. 6).",
      "4 Objectifs (CQFD) : Besoins respectés (F), Spécification respectée (Q), Coût (C) et Délai (D) tenus (p. 7)."
    ],
    nodes: [
      { id: 'n-prog', label: "Programmes", page: 3, role: "Code source ou exécutable assurant le traitement automatique.", pos: [-2.4, 1.3, 0.3] },
      { id: 'n-doc', label: "Documentations", page: 3, role: "Manuels techniques et d'utilisation indissociables du code.", pos: [2.4, 1.3, 0.3] },
      { id: 'n-conf', label: "Configuration", page: 3, role: "Fichiers et paramètres nécessaires au bon fonctionnement.", pos: [0, -1.7, 1.3] },
      { id: 'n-c', label: "Coût (C)", page: 6, role: "Respecter le budget alloué par le client.", pos: [-4.0, 2.6, -1.5] },
      { id: 'n-q', label: "Qualité (Q)", page: 6, role: "Garantir la fiabilité et le respect des spécifications.", pos: [4.0, 2.6, -1.5] },
      { id: 'n-f', label: "Fonctionnalité (F)", page: 6, role: "Répondre exactement aux besoins réels du client.", pos: [-4.0, -2.2, -1.5] },
      { id: 'n-d', label: "Délai (D)", page: 6, role: "Livrer le produit dans le temps imparti.", pos: [4.0, -2.2, -1.5] }
    ]
  },
  {
    id: 'ch2',
    index: 2,
    shortTitle: "2. Les 7 Principes",
    title: "Les 7 Principes du Génie Logiciel",
    pages: "p. 8–12",
    accentColor: "#a855f7",
    cameraPos: [0, 4.2, 13.2],
    formula: "Programmation = Activité personnelle  ≠  Génie Logiciel = Activité d'équipe (Grande taille)",
    bullets: [
      "Permettent de maîtriser la complexité des grands projets multi-versions (p. 12).",
      "Découper le problème en modules indépendants (Modularité) et cacher les détails (Abstraction).",
      "Anticiper les évolutions continuelles du logiciel (Application du changement, p. 11)."
    ],
    nodes: [
      { id: 'p-1', label: "1. Rigueur", page: 8, role: "Logique et précision strictes pour éviter toute ambiguïté.", pos: [0, 2.6, 0] },
      { id: 'p-2', label: "2. Séparation", page: 8, role: "Traiter séparément les différents aspects d'un problème.", pos: [-3.6, 1.4, 1.4] },
      { id: 'p-3', label: "3. Modularité", page: 8, role: "Diviser en modules simples, homogènes, indépendants et reliés.", pos: [3.6, 1.4, 1.4] },
      { id: 'p-4', label: "4. Abstraction", page: 9, role: "Ne retenir que les aspects importants à un niveau donné.", pos: [-4.2, -0.8, -0.8] },
      { id: 'p-5', label: "5. Généricité", page: 9, role: "Créer des composants paramétrables et réutilisables.", pos: [4.2, -0.8, -0.8] },
      { id: 'p-6', label: "6. Incrémental", page: 10, role: "Partir d'un noyau fonctionnel et l'étendre par étapes.", pos: [-2.0, -2.4, 1.2] },
      { id: 'p-7', label: "7. Changement", page: 11, role: "Localiser les modifications et gérer les versions.", pos: [2.0, -2.4, 1.2] }
    ]
  },
  {
    id: 'ch3',
    index: 3,
    shortTitle: "3. Les 8 Acteurs",
    title: "Les 8 Acteurs & Flux de Travail",
    pages: "p. 13–20",
    accentColor: "#f59e0b",
    cameraPos: [0, 5.0, 14.0],
    formula: "1. Client → 2. CDP & Analyste → 3. Architecte → 4. Développeurs → 5. Utilisateurs → 6. Maintenance",
    bullets: [
      "8 rôles aux intérêts différents qui doivent communiquer clairement (p. 13, 20).",
      "Le Client finance et valide ; l'Utilisateur emploie le logiciel et signale les bugs (p. 14).",
      "Le Chef de projet coordonne ; l'Analyste spécifie (Quoi) ; l'Architecte structure (Comment)."
    ],
    nodes: [
      { id: 'a-client', label: "1. Client", page: 14, role: "Finance le projet, exprime le besoin, fixe le budget et valide.", pos: [-4.8, -1.8, 1.2] },
      { id: 'a-user', label: "2. Utilisateurs", page: 14, role: "Utilisent le logiciel au quotidien et donnent des retours (ergonomie/bugs).", pos: [-4.8, 2.0, 1.2] },
      { id: 'a-mgr', label: "3. Manager", page: 15, role: "Intermédiaire entre client et équipe technique ; définit les priorités.", pos: [-2.6, -0.2, 2.0] },
      { id: 'a-cdp', label: "4. Chef de Projet", page: 16, role: "Planifie les délais, gère les ressources et coordonne toute l'équipe.", pos: [-0.5, -1.8, 0.6] },
      { id: 'a-ana', label: "5. Analyste", page: 16, role: "Rédige le cahier des charges, les spécifications et cas d'utilisation.", pos: [-0.5, 2.0, 0.6] },
      { id: 'a-arch', label: "6. Architecte", page: 17, role: "Conçoit l'architecture (composants, BDD) et veille aux bonnes pratiques.", pos: [2.5, 2.0, 0.4] },
      { id: 'a-dev', label: "7. Développeurs", page: 17, role: "Écrivent, optimisent et corrigent le code source.", pos: [2.5, -1.8, 0.4] },
      { id: 'a-maint', label: "8. Maintenance", page: 18, role: "Assure les correctifs et mises à jour après déploiement.", pos: [5.0, 0.4, -0.5] }
    ]
  },
  {
    id: 'ch4',
    index: 4,
    shortTitle: "4. Cycle de Vie",
    title: "Architecture du Cycle de Vie",
    pages: "p. 21–26",
    accentColor: "#10b981",
    cameraPos: [0, 4.4, 13.8],
    formula: "Processus = Activités (QUOI ?) + Enchaînement (QUAND ?)  |  Développement ⊂ Cycle de Vie",
    bullets: [
      "Cycle de vie : de l'idée initiale jusqu'au retrait définitif (mise hors service, p. 23).",
      "Cycle de développement : uniquement de la décision de développer jusqu'à l'installation (p. 23).",
      "Étude préalable (Avant-projet) : étudie l'existant, la faisabilité et produit le Cahier des charges (p. 25)."
    ],
    nodes: [
      { id: 'cv-avant', label: "Avant-Projet (Étude préalable)", page: 25, role: "Analyse besoins, marché et faisabilité → Cahier des charges du projet.", pos: [-4.8, 0.2, 0] },
      { id: 'cv-gest', label: "Gestion de Projet", page: 24, role: "Initiation → Planification, Pilotage & Qualité → Évaluation.", pos: [-0.2, 2.8, 0] },
      { id: 'cv-dev', label: "Cycle de Développement", page: 26, role: "Analyse → Conception → Implémentation → Tests → Installation.", pos: [-0.2, 0.1, 0] },
      { id: 'cv-exp', label: "Exploitation & Maintenance", page: 40, role: "Maintien en service, assistance et évolutions après livraison.", pos: [3.6, 0.2, 0] },
      { id: 'cv-ret', label: "Retrait", page: 43, role: "Exploitation parallèle avec le successeur puis arrêt du support.", pos: [5.6, 0.2, 0] }
    ]
  },
  {
    id: 'ch5',
    index: 5,
    shortTitle: "5. Développement",
    title: "Étapes Techniques : Analyse à Installation",
    pages: "p. 27–34",
    accentColor: "#06b6d4",
    cameraPos: [0, 4.0, 13.5],
    formula: "Analyse = QUOI ? (Vue externe / Spécification)  |  Conception = COMMENT ? (Architecture & Algos)",
    bullets: [
      "1. Analyse (p. 27) : définit QUOI faire → produit le Document de spécification.",
      "2. Conception (p. 28–31) : définit COMMENT faire → Globale (architecture) puis Détaillée (algorithmes).",
      "3. Implémentation (code compilé) → 4. Tests (unitaires/intégration/système) → 5. Installation sur site."
    ],
    nodes: [
      { id: 'd-ana', label: "1. Analyse (QUOI ?)", page: 27, role: "Entrée : Cahier des charges → Sortie : Spécifications du logiciel.", pos: [-4.8, 2.0, 0] },
      { id: 'd-cg', label: "2a. Conception Globale", page: 29, role: "Définit l'architecture : modules, composants et interfaces.", pos: [-2.4, 1.1, 0.4] },
      { id: 'd-cd', label: "2b. Conception Détaillée", page: 30, role: "Décompose jusqu'aux composants élémentaires et algorithmes.", pos: [-0.1, 0.2, 0] },
      { id: 'd-imp', label: "3. Implémentation", page: 32, role: "Traduction en code source et compilation des composants.", pos: [2.2, -0.7, -0.4] },
      { id: 'd-tst', label: "4. Tests", page: 33, role: "Vérification : tests unitaires, d'intégration et système.", pos: [4.1, -1.5, 0.3] },
      { id: 'd-ins', label: "5. Installation", page: 34, role: "Déploiement chez le client, tests de réception et manuels.", pos: [5.8, -2.2, 0] }
    ]
  },
  {
    id: 'ch6',
    index: 6,
    shortTitle: "6. V&V & Maintenance",
    title: "Activités Transversales & Maintenance",
    pages: "p. 35–43",
    accentColor: "#ec4899",
    cameraPos: [0, 4.5, 13.5],
    formula: "Validation = « Le BON produit ? » (Utilité)  |  Vérification = « BIEN construit ? » (Cohérence)",
    bullets: [
      "3 Activités continues : Documentation (11 docs types), V&V et Gestion de configuration (versions, p. 36–39).",
      "Norme ISO/IEC 14764 : 3 types de maintenance après livraison (Corrective, Adaptative, Perfective, p. 41)."
    ],
    nodes: [
      { id: 't-doc', label: "Documentation (11 docs)", page: 37, role: "Gestion, technique et manuels. Trace les décisions et l'avancement.", pos: [-3.8, 2.0, 0] },
      { id: 't-vv', label: "V&V (Vérification/Validation)", page: 38, role: "Validation = besoin client respecté ; Vérification = cohérence interne.", pos: [-3.8, 0, 0] },
      { id: 't-cfg', label: "Gestion Configuration", page: 39, role: "Identifie, archive et contrôle les modifications de tous les éléments.", pos: [-3.8, -2.0, 0] },
      { id: 'm-cor', label: "Maint. Corrective", page: 41, role: "Corriger les défauts et bugs après livraison.", pos: [3.4, 2.0, 0.4] },
      { id: 'm-ada', label: "Maint. Adaptative", page: 41, role: "Adapter le logiciel à un environnement qui change.", pos: [4.2, 0, -0.4] },
      { id: 'm-per', label: "Maint. Perfective", page: 41, role: "Améliorer l'efficacité, la performance et la maintenabilité.", pos: [3.4, -2.0, 0.4] }
    ]
  },
  {
    id: 'ch7',
    index: 7,
    shortTitle: "7. Cascade & V",
    title: "Modèles Linéaires : Cascade vs Modèle en V",
    pages: "p. 44–48",
    accentColor: "#6366f1",
    cameraPos: [0, 4.0, 14.2],
    formula: "Besoins ↔ Acceptation | Spécifications ↔ Système | Conception ↔ Intégration | Codage ↔ Unitaire",
    bullets: [
      "Cascade (p. 46) : séquentiel strict. Simple et structuré, mais rigide si les besoins changent.",
      "Modèle en V (p. 48) : associe chaque phase de conception (gauche) à son test (droite). Idéal pour le critique (banque, médical)."
    ],
    nodes: [
      { id: 'v-cas', label: "Modèle en Cascade", page: 46, role: "Ordre fixe : on ne passe à la suite que si l'étape est 100% validée.", pos: [-4.6, 2.0, 0] },
      { id: 'v-left', label: "Branche Gauche (Conception)", page: 47, role: "Besoins → Spécification → Conception arch. → Conception détaillée.", pos: [-1.6, 0.9, 0] },
      { id: 'v-cod', label: "Programmation (Codage)", page: 47, role: "Pointe inférieure du V reliant conception et tests.", pos: [1.0, -2.3, 0] },
      { id: 'v-right', label: "Branche Droite (Tests)", page: 48, role: "Tests unitaires → Intégration → Système / Acceptation.", pos: [3.6, 0.9, 0] }
    ]
  },
  {
    id: 'ch8',
    index: 8,
    shortTitle: "8. Spirale & Incrémental",
    title: "Modèles Itératifs : Spirale & Incrémental",
    pages: "p. 49–53",
    accentColor: "#f43f5e",
    cameraPos: [0, 4.8, 14.0],
    formula: "Spirale = 4 Quadrants (Focus Risques & Prototype)  |  Incrémental = Versions 1 → 2 → 3",
    bullets: [
      "Modèle en Spirale (p. 50) : chaque cycle répète 4 phases avec prototypage pour éliminer les risques. Coûteux mais idéal pour grands projets complexes.",
      "Modèle Incrémental (p. 53) : livre vite une V1 de base puis ajoute des fonctionnalités (Analyse→Conception→Codage→Tests à chaque incrément)."
    ],
    nodes: [
      { id: 's-q1', label: "Q1. Objectifs", page: 50, role: "Définir besoins, fonctionnalités et contraintes du cycle.", pos: [-4.2, 1.9, 0.8] },
      { id: 's-q2', label: "Q2. Risques & Prototype", page: 50, role: "Identifier les risques et créer un prototype pour les réduire.", pos: [-1.4, 2.1, -0.6] },
      { id: 's-q3', label: "Q3. Dév. & Tests", page: 50, role: "Concevoir, coder et effectuer les tests partiels.", pos: [-1.4, -1.7, 0.8] },
      { id: 's-q4', label: "Q4. Évaluation Client", page: 50, role: "Validation par le client et planification du cycle suivant.", pos: [-4.2, -1.7, -0.6] },
      { id: 's-inc', label: "Modèle Incrémental (V1→V3)", page: 53, role: "Livraison rapide et progressive par petites versions complètes.", pos: [3.6, 0.1, 0] }
    ]
  }
];

function createTechMesh(geometry, colorHex, opacity = 0.88) {
  const group = new THREE.Group();
  const baseColor = new THREE.Color(colorHex);
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: baseColor,
      emissiveIntensity: 0.15,
      roughness: 0.3,
      metalness: 0.6,
      transparent: opacity < 1,
      opacity
    })
  );
  group.add(mesh);

  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({
      color: baseColor.clone().lerp(new THREE.Color('#ffffff'), 0.55),
      transparent: true,
      opacity: 0.65
    })
  );
  group.add(wire);
  return group;
}

function createLine(p1, p2, colorHex, dashed = false) {
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...p1),
    new THREE.Vector3(...p2)
  ]);
  const mat = dashed
    ? new THREE.LineDashedMaterial({ color: colorHex, dashSize: 0.25, gapSize: 0.14, transparent: true, opacity: 0.65 })
    : new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.5 });
  const line = new THREE.Line(geo, mat);
  if (dashed) line.computeLineDistances();
  return line;
}

export default function App() {
  const [chapterIdx, setChapterIdx] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState(CHAPTERS[0].nodes[0].id);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vMorph, setVMorph] = useState(1); // 1 = Modèle en V, 0 = Cascade
  const [showCard, setShowCard] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mobileTab, setMobileTab] = useState('summary'); // 'summary' | 'node'
  const [mobilePanelOpen, setMobilePanelOpen] = useState(true);

  const currentChapter = CHAPTERS[chapterIdx];

  const selectedNode = useMemo(() => {
    return (
      currentChapter.nodes.find((n) => n.id === selectedNodeId) ||
      currentChapter.nodes[0]
    );
  }, [currentChapter, selectedNodeId]);

  const mountRef = useRef(null);
  const labelDomRefs = useRef({});
  const stateRef = useRef({
    chapterIdx: 0,
    selectedNodeId: CHAPTERS[0].nodes[0].id,
    hoveredNodeId: null,
    vMorph: 1,
    azimuth: 0,
    elevation: 0.26,
    distance: 13.0,
    desiredAzimuth: 0,
    desiredElevation: 0.26,
    desiredDistance: 13.0,
    target: new THREE.Vector3(0, 0.1, 0),
    desiredTarget: new THREE.Vector3(0, 0.1, 0),
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    pinchDist: 0
  });

  useEffect(() => {
    stateRef.current.chapterIdx = chapterIdx;
    stateRef.current.selectedNodeId = selectedNodeId;
    stateRef.current.hoveredNodeId = hoveredNodeId;
    stateRef.current.vMorph = vMorph;
  }, [chapterIdx, selectedNodeId, hoveredNodeId, vMorph]);

  // Switch chapter cleanly
  const selectChapter = useCallback((idx) => {
    const nextIdx = Math.max(0, Math.min(CHAPTERS.length - 1, idx));
    setChapterIdx(nextIdx);
    const ch = CHAPTERS[nextIdx];
    setSelectedNodeId(ch.nodes[0].id);
    setMobileTab('summary');
    stateRef.current.desiredAzimuth = 0;
    stateRef.current.desiredElevation = 0.26;
    stateRef.current.desiredDistance = ch.cameraPos[2];
    stateRef.current.desiredTarget.set(0, 0.1, 0);
  }, []);

  // Select a 3D node and switch mobile tab to Inspector automatically
  const handleSelectNode = useCallback((node) => {
    setSelectedNodeId(node.id);
    setMobileTab('node');
    setMobilePanelOpen(true);
    stateRef.current.desiredTarget.set(node.pos[0] * 0.3, node.pos[1] * 0.3, node.pos[2] * 0.3);
  }, []);

  // Zoom helper for mobile buttons
  const adjustZoom = useCallback((delta) => {
    stateRef.current.desiredDistance = Math.max(
      7,
      Math.min(22, stateRef.current.desiredDistance + delta)
    );
  }, []);

  // Auto-advance chapters when playing
  useEffect(() => {
    if (!isPlaying || showWelcome) return;
    const timer = setInterval(() => {
      setChapterIdx((prev) => {
        const next = (prev + 1) % CHAPTERS.length;
        setSelectedNodeId(CHAPTERS[next].nodes[0].id);
        setMobileTab('summary');
        return next;
      });
    }, 6500);
    return () => clearInterval(timer);
  }, [isPlaying, showWelcome]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (showWelcome) {
        if (e.code === 'Enter' || e.code === 'Space' || e.code === 'Escape') {
          e.preventDefault();
          setShowWelcome(false);
        }
        return;
      }
      if (e.code === 'ArrowRight') selectChapter(chapterIdx + 1);
      else if (e.code === 'ArrowLeft') selectChapter(chapterIdx - 1);
      else if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chapterIdx, selectChapter, showWelcome]);

  // Three.js Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.domElement.style.touchAction = 'none';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070b14');
    scene.fog = new THREE.FogExp2('#070b14', 0.02);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 120);

    scene.add(new THREE.AmbientLight('#94a3b8', 0.95));
    const dirLight = new THREE.DirectionalLight('#f8fafc', 1.8);
    dirLight.position.set(10, 16, 12);
    scene.add(dirLight);

    const accentLight = new THREE.PointLight('#38bdf8', 2.2, 28);
    accentLight.position.set(0, 3, 2);
    scene.add(accentLight);

    const grid = new THREE.GridHelper(42, 42, '#1e293b', '#0f172a');
    grid.position.y = -3.6;
    scene.add(grid);

    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.9, 1.08, 40),
      new THREE.MeshBasicMaterial({ color: '#38bdf8', side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    halo.rotation.x = Math.PI / 2;
    scene.add(halo);

    const nodeObjectMap = new Map();
    const registerNode = (id, obj) => {
      nodeObjectMap.set(id, obj);
      obj.traverse((c) => {
        if (c.isMesh) c.userData.nodeId = id;
      });
    };

    const chapterGroups = CHAPTERS.map(() => {
      const g = new THREE.Group();
      scene.add(g);
      return g;
    });

    // CH1: Logiciel & CQFD
    const g1 = chapterGroups[0];
    const core1 = createTechMesh(new THREE.IcosahedronGeometry(0.88, 1), '#0ea5e9');
    g1.add(core1);
    const ch1Colors = ['#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#10b981', '#38bdf8', '#f43f5e'];
    CHAPTERS[0].nodes.forEach((n, i) => {
      const geo = i < 3 ? new THREE.OctahedronGeometry(0.76) : new THREE.DodecahedronGeometry(0.68);
      const m = createTechMesh(geo, ch1Colors[i]);
      m.position.set(...n.pos);
      g1.add(m);
      registerNode(n.id, m);
      g1.add(createLine([0, 0, 0], n.pos, ch1Colors[i], i >= 3));
    });

    // CH2: 7 Principes
    const g2 = chapterGroups[1];
    const pColors = ['#38bdf8', '#c084fc', '#818cf8', '#34d399', '#fbbf24', '#f472b6', '#fb7185'];
    CHAPTERS[1].nodes.forEach((n, i) => {
      const geo = i === 0 ? new THREE.OctahedronGeometry(0.9) : new THREE.CylinderGeometry(0.68, 0.68, 1.0, 6);
      const m = createTechMesh(geo, pColors[i]);
      m.position.set(...n.pos);
      g2.add(m);
      registerNode(n.id, m);
      if (i > 0) g2.add(createLine([0, 2.6, 0], n.pos, pColors[i]));
    });

    // CH3: 8 Acteurs
    const g3 = chapterGroups[2];
    const aColors = ['#f59e0b', '#38bdf8', '#a855f7', '#10b981', '#06b6d4', '#6366f1', '#ec4899', '#f43f5e'];
    const aPos = {};
    CHAPTERS[2].nodes.forEach((n, i) => {
      const av = new THREE.Group();
      const body = createTechMesh(new THREE.CylinderGeometry(0.45, 0.6, 1.0, 8), aColors[i]);
      const head = createTechMesh(new THREE.SphereGeometry(0.32, 12, 12), '#f8fafc');
      head.position.y = 0.85;
      av.add(body, head);
      av.position.set(...n.pos);
      g3.add(av);
      aPos[n.id] = n.pos;
      registerNode(n.id, av);
    });
    [
      ['a-user', 'a-client'], ['a-user', 'a-ana'], ['a-client', 'a-mgr'],
      ['a-client', 'a-cdp'], ['a-mgr', 'a-cdp'], ['a-cdp', 'a-ana'],
      ['a-ana', 'a-arch'], ['a-cdp', 'a-arch'], ['a-arch', 'a-dev'], ['a-dev', 'a-maint']
    ].forEach(([a, b]) => g3.add(createLine(aPos[a], aPos[b], '#475569')));

    // CH4: Cycle de Vie
    const g4 = chapterGroups[3];
    const cvSizes = [[1.9, 3.6, 1.4], [8.8, 0.8, 1.6], [5.8, 2.6, 1.5], [1.8, 3.6, 1.4], [1.3, 3.6, 1.4]];
    const cvCols = ['#10b981', '#f59e0b', '#06b6d4', '#a855f7', '#64748b'];
    CHAPTERS[3].nodes.forEach((n, i) => {
      const m = createTechMesh(new THREE.BoxGeometry(...cvSizes[i]), cvCols[i], 0.85);
      m.position.set(...n.pos);
      g4.add(m);
      registerNode(n.id, m);
    });

    // CH5: Développement (Analyse -> Installation)
    const g5 = chapterGroups[4];
    const dCols = ['#38bdf8', '#818cf8', '#a855f7', '#06b6d4', '#10b981', '#f59e0b'];
    CHAPTERS[4].nodes.forEach((n, i) => {
      const m = createTechMesh(new THREE.BoxGeometry(2.0, 0.9, 1.3), dCols[i]);
      m.position.set(...n.pos);
      g5.add(m);
      registerNode(n.id, m);
      if (i > 0) g5.add(createLine(CHAPTERS[4].nodes[i - 1].pos, n.pos, '#38bdf8'));
    });

    // CH6: V&V & Maintenance
    const g6 = chapterGroups[5];
    const ch6Cols = ['#38bdf8', '#ec4899', '#a855f7', '#f43f5e', '#f59e0b', '#10b981'];
    CHAPTERS[5].nodes.forEach((n, i) => {
      const geo = i < 3 ? new THREE.BoxGeometry(3.8, 0.8, 1.2) : new THREE.OctahedronGeometry(0.8);
      const m = createTechMesh(geo, ch6Cols[i]);
      m.position.set(...n.pos);
      g6.add(m);
      registerNode(n.id, m);
      if (i >= 3) g6.add(createLine([-1.8, 0, 0], n.pos, ch6Cols[i], true));
    });

    // CH7: Cascade vs Modèle en V
    const g7 = chapterGroups[6];
    const vCols = ['#38bdf8', '#6366f1', '#ec4899', '#10b981'];
    CHAPTERS[6].nodes.forEach((n, i) => {
      const m = createTechMesh(new THREE.BoxGeometry(2.2, 0.9, 1.2), vCols[i]);
      m.position.set(...n.pos);
      g7.add(m);
      registerNode(n.id, m);
    });
    const vSteps = [
      { vPos: [-3.0, 2.4, -1.0], casPos: [-4.8, 2.4, -1.0], c: '#38bdf8' },
      { vPos: [-1.8, 0.8, -1.0], casPos: [-2.4, 1.1, -1.0], c: '#818cf8' },
      { vPos: [1.0, -2.2, -1.0], casPos: [0.2, -0.3, -1.0], c: '#ec4899' },
      { vPos: [3.2, 0.8, -1.0], casPos: [2.6, -1.4, -1.0], c: '#10b981' },
      { vPos: [4.4, 2.4, -1.0], casPos: [4.8, -2.4, -1.0], c: '#f59e0b' }
    ];
    const vDynamic = vSteps.map((s) => {
      const b = createTechMesh(new THREE.BoxGeometry(1.4, 0.5, 0.7), s.c, 0.8);
      b.position.set(...s.vPos);
      g7.add(b);
      return { b, vPos: s.vPos, casPos: s.casPos };
    });
    const vBridges = [
      createLine([-3.0, 2.4, -1.0], [4.4, 2.4, -1.0], '#f59e0b', true),
      createLine([-1.8, 0.8, -1.0], [3.2, 0.8, -1.0], '#10b981', true)
    ];
    vBridges.forEach((l) => g7.add(l));

    // CH8: Spirale & Incrémental
    const g8 = chapterGroups[7];
    const spPts = [];
    for (let i = 0; i <= 90; i++) {
      const t = i / 90;
      const a = t * Math.PI * 5.5;
      const r = 0.4 + t * 2.8;
      spPts.push(new THREE.Vector3(-2.8 + Math.cos(a) * r, (t - 0.5) * 3.2, Math.sin(a) * r * 0.65));
    }
    g8.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spPts), 90, 0.1, 10, false),
        new THREE.MeshStandardMaterial({ color: '#f43f5e', emissive: '#881337', emissiveIntensity: 0.35 })
      )
    );
    const ch8Cols = ['#f472b6', '#a855f7', '#ef4444', '#ec4899', '#10b981'];
    CHAPTERS[7].nodes.forEach((n, i) => {
      if (i < 4) {
        const m = createTechMesh(new THREE.OctahedronGeometry(0.72), ch8Cols[i]);
        m.position.set(...n.pos);
        g8.add(m);
        registerNode(n.id, m);
      } else {
        const inc = new THREE.Group();
        [-1.1, 0, 1.1].forEach((y, k) => {
          const box = createTechMesh(new THREE.BoxGeometry(2.3 - k * 0.35, 0.9, 1.8 - k * 0.3), ['#10b981', '#06b6d4', '#38bdf8'][k]);
          box.position.y = y;
          inc.add(box);
        });
        inc.position.set(...n.pos);
        g8.add(inc);
        registerNode(n.id, inc);
      }
    });

    // Pointer & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const pickNode = (cx, cy) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((cx - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((cy - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const activeG = chapterGroups[stateRef.current.chapterIdx];
      const meshes = [];
      activeG?.traverse((c) => {
        if (c.isMesh && c.userData.nodeId) meshes.push(c);
      });
      const hits = raycaster.intersectObjects(meshes, false);
      return hits.length > 0 ? hits[0].object.userData.nodeId : null;
    };

    const onDown = (e) => {
      stateRef.current.isDragging = true;
      stateRef.current.lastMouse = { x: e.clientX, y: e.clientY };
      downPos = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e) => {
      if (stateRef.current.isDragging) {
        const dx = e.clientX - stateRef.current.lastMouse.x;
        const dy = e.clientY - stateRef.current.lastMouse.y;
        stateRef.current.lastMouse = { x: e.clientX, y: e.clientY };
        stateRef.current.desiredAzimuth -= dx * 0.0055;
        stateRef.current.desiredElevation = Math.max(-0.15, Math.min(1.1, stateRef.current.desiredElevation + dy * 0.0045));
      } else {
        const h = pickNode(e.clientX, e.clientY);
        if (h !== stateRef.current.hoveredNodeId) {
          setHoveredNodeId(h);
          renderer.domElement.style.cursor = h ? 'pointer' : 'grab';
        }
      }
    };
    const onUp = (e) => {
      stateRef.current.isDragging = false;
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) < 6) {
        const clicked = pickNode(e.clientX, e.clientY);
        if (clicked) {
          setSelectedNodeId(clicked);
          setMobileTab('node');
          setMobilePanelOpen(true);
          const ch = CHAPTERS[stateRef.current.chapterIdx];
          const nd = ch.nodes.find((n) => n.id === clicked);
          if (nd) stateRef.current.desiredTarget.set(nd.pos[0] * 0.3, nd.pos[1] * 0.3, nd.pos[2] * 0.3);
        }
      }
    };
    const onWheel = (e) => {
      e.preventDefault();
      stateRef.current.desiredDistance = Math.max(7, Math.min(22, stateRef.current.desiredDistance + e.deltaY * 0.008));
    };

    // Two-finger pinch-to-zoom for mobile screens
    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        stateRef.current.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        stateRef.current.pinchDist = Math.hypot(dx, dy);
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && stateRef.current.pinchDist > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDist = Math.hypot(dx, dy);
        const diff = stateRef.current.pinchDist - newDist;
        stateRef.current.pinchDist = newDist;
        stateRef.current.desiredDistance = Math.max(
          7,
          Math.min(22, stateRef.current.desiredDistance + diff * 0.035)
        );
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: false });

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const scratchVec = new THREE.Vector3();
    const scratchWorld = new THREE.Vector3();
    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const { chapterIdx: cIdx, selectedNodeId: selId, hoveredNodeId: hovId, vMorph: morph } = stateRef.current;
      const activeCh = CHAPTERS[cIdx];

      chapterGroups.forEach((g, i) => {
        g.visible = i === cIdx;
      });

      accentLight.color.set(activeCh.accentColor);
      core1.rotation.y = t * 0.5;

      if (cIdx === 6) {
        vDynamic.forEach(({ b, vPos, casPos }) => {
          b.position.x = THREE.MathUtils.lerp(casPos[0], vPos[0], morph);
          b.position.y = THREE.MathUtils.lerp(casPos[1], vPos[1], morph);
          b.position.z = THREE.MathUtils.lerp(casPos[2], vPos[2], morph);
        });
        vBridges.forEach((l) => {
          l.visible = morph > 0.3;
        });
      }

      let haloVisible = false;
      nodeObjectMap.forEach((obj, id) => {
        const s = id === selId ? 1.22 : id === hovId ? 1.1 : 1.0;
        scratchVec.set(s, s, s);
        obj.scale.lerp(scratchVec, 0.15);
        if (id === selId && activeCh.nodes.some((n) => n.id === id)) {
          obj.getWorldPosition(scratchWorld);
          halo.position.set(scratchWorld.x, scratchWorld.y - 0.8, scratchWorld.z);
          halo.material.color.set(activeCh.accentColor);
          haloVisible = true;
        }
      });
      halo.visible = haloVisible;

      // Camera damping + responsive portrait distance multiplier so wide 3D diagrams fit mobile screens
      const isPortrait = camera.aspect < 0.85;
      const portraitScale = isPortrait ? Math.min(1.55, 0.92 / Math.sqrt(camera.aspect)) : 1.0;
      const yOffset = isPortrait ? -0.9 : 0.0; // shift target down on mobile so 3D models sit in the upper half

      stateRef.current.azimuth += (stateRef.current.desiredAzimuth - stateRef.current.azimuth) * 0.1;
      stateRef.current.elevation += (stateRef.current.desiredElevation - stateRef.current.elevation) * 0.1;
      stateRef.current.distance += (stateRef.current.desiredDistance - stateRef.current.distance) * 0.1;
      stateRef.current.target.lerp(stateRef.current.desiredTarget, 0.1);

      const { azimuth: az, elevation: el, distance: dist, target } = stateRef.current;
      const effectiveDist = dist * portraitScale;
      const lookTarget = scratchVec.set(target.x, target.y + yOffset, target.z);

      camera.position.set(
        lookTarget.x + Math.sin(az) * Math.cos(el) * effectiveDist,
        lookTarget.y + Math.sin(el) * effectiveDist,
        lookTarget.z + Math.cos(az) * Math.cos(el) * effectiveDist
      );
      camera.lookAt(lookTarget);

      renderer.render(scene, camera);

      // Direct 60fps DOM label projection
      const w = container.clientWidth;
      const h = container.clientHeight;
      activeCh.nodes.forEach((n) => {
        const elDom = labelDomRefs.current[n.id];
        const obj = nodeObjectMap.get(n.id);
        if (!elDom || !obj) return;
        obj.getWorldPosition(scratchWorld);
        scratchWorld.y += 1.05;
        scratchWorld.project(camera);
        if (scratchWorld.z > 1 || scratchWorld.z < -1) {
          elDom.style.opacity = '0';
          return;
        }
        const x = (scratchWorld.x * 0.5 + 0.5) * w;
        const y = (-(scratchWorld.y * 0.5) + 0.5) * h;
        elDom.style.opacity = '1';
        elDom.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[100dvh] bg-[#070b14] text-slate-100 overflow-hidden select-none font-sans flex flex-col justify-between">
      {/* 3D CANVAS */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />

      {/* FLOATING 3D LABELS */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {currentChapter.nodes.map((node) => {
          const isSel = node.id === selectedNodeId;
          return (
            <button
              key={node.id}
              ref={(el) => {
                if (el) labelDomRefs.current[node.id] = el;
              }}
              onClick={() => handleSelectNode(node)}
              className={`pointer-events-auto absolute top-0 left-0 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-1 sm:gap-1.5 shadow-lg backdrop-blur-md border transition-colors ${
                isSel
                  ? 'bg-sky-400 text-slate-950 border-white font-bold z-30 scale-105'
                  : 'bg-slate-950/80 text-slate-200 border-slate-700/80 hover:border-sky-400 z-10'
              }`}
            >
              <span
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0"
                style={{ backgroundColor: isSel ? '#0f172a' : currentChapter.accentColor }}
              />
              <span className="truncate max-w-[115px] sm:max-w-none">{node.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOP BAR: CLEAN CHAPTER SELECTOR + HELP BUTTON */}
      <header className="relative z-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-2.5 sm:px-4 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-slate-950 shadow-sm"
            style={{ backgroundColor: currentChapter.accentColor }}
          >
            GL
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-bold text-white leading-none">RÉSUMÉ 3D — GÉNIE LOGICIEL</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Chapitre 1 • ISET Kélibia (53 pages)</div>
          </div>
        </div>

        {/* Horizontal scrollable chapter pills */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 flex-1 md:flex-initial">
          {CHAPTERS.map((ch, idx) => {
            const active = idx === chapterIdx;
            return (
              <button
                key={ch.id}
                onClick={() => selectChapter(idx)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  active
                    ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: ch.accentColor, opacity: active ? 1 : 0.4 }}
                />
                <span>{ch.shortTitle}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowWelcome(true)}
            className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-1"
            title="Guide d'utilisation"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          <button
            onClick={() => {
              stateRef.current.desiredAzimuth = 0;
              stateRef.current.desiredElevation = 0.26;
              stateRef.current.desiredDistance = currentChapter.cameraPos[2];
              stateRef.current.desiredTarget.set(0, 0.1, 0);
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
            title="Réinitialiser la caméra 3D"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* FLOATING MOBILE ZOOM & HINT BAR (TOP RIGHT BELOW HEADER) */}
      <div className="relative z-20 flex items-center justify-between px-3 pt-2 pointer-events-none md:hidden">
        <div className="pointer-events-auto bg-slate-950/75 backdrop-blur-md border border-slate-800/80 rounded-full px-2.5 py-1 text-[10px] text-slate-300 flex items-center gap-1.5">
          <Hand className="w-3 h-3 text-sky-400" />
          <span>1 doigt : tourner • Touchez un objet 3D</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => adjustZoom(-1.8)}
            className="p-1.5 text-slate-300 active:text-white"
            aria-label="Zoomer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => adjustZoom(1.8)}
            className="p-1.5 text-slate-300 active:text-white"
            aria-label="Dézoomer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DESKTOP SIDE PANELS (HIDDEN ON MOBILE) */}
      <div className="hidden md:flex relative z-20 flex-1 items-start justify-between p-4 gap-4 pointer-events-none overflow-hidden">
        {/* LEFT SUMMARY CARD ("FICHE DE RÉVISION") */}
        <div className="pointer-events-auto w-96 bg-slate-950/85 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-slate-950"
                style={{ backgroundColor: currentChapter.accentColor }}
              >
                Fiche {currentChapter.index}/8
              </span>
              <span className="text-xs font-mono text-slate-400">{currentChapter.pages}</span>
            </div>
            <button
              onClick={() => setShowCard((s) => !s)}
              className="text-[11px] text-slate-400 hover:text-white"
            >
              {showCard ? 'Réduire' : 'Déplier'}
            </button>
          </div>

          <h1 className="text-base font-bold text-white leading-snug">{currentChapter.title}</h1>

          {showCard && (
            <>
              <div className="bg-slate-900/90 border-l-2 border-sky-400 rounded-r-lg p-2.5 text-xs font-mono text-sky-200">
                {currentChapter.formula}
              </div>

              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                {currentChapter.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {currentChapter.index === 7 && (
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setVMorph(0)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      vMorph === 0
                        ? 'bg-sky-400 text-slate-950 border-white'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    Vue Cascade (p. 45)
                  </button>
                  <button
                    onClick={() => setVMorph(1)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      vMorph === 1
                        ? 'bg-indigo-500 text-white border-white'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    Vue Modèle en V (p. 47)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT COMPACT NODE INSPECTOR */}
        {selectedNode && (
          <div className="pointer-events-auto w-80 bg-slate-950/85 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 shadow-2xl space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-sky-400 uppercase">
                <Box className="w-3.5 h-3.5" /> Élément 3D sélectionné
              </span>
              <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-amber-300">
                PDF p.{selectedNode.page}
              </span>
            </div>

            <div className="text-sm font-bold text-white">{selectedNode.label}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedNode.role}</p>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
              {currentChapter.nodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleSelectNode(n)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors border ${
                    n.id === selectedNodeId
                      ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE UNIFIED BOTTOM SHEET (VISIBLE ONLY ON < MD) */}
      <div className="md:hidden relative z-20 mt-auto px-2.5 pb-1.5 pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/92 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab Switcher Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 px-2 py-1.5 bg-slate-900/60">
            <div className="flex items-center gap-1 flex-1">
              <button
                onClick={() => {
                  setMobileTab('summary');
                  setMobilePanelOpen(true);
                }}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  mobileTab === 'summary' && mobilePanelOpen
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Fiche {currentChapter.index}/8</span>
              </button>

              <button
                onClick={() => {
                  setMobileTab('node');
                  setMobilePanelOpen(true);
                }}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  mobileTab === 'node' && mobilePanelOpen
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate max-w-[120px]">{selectedNode?.label}</span>
              </button>
            </div>

            <button
              onClick={() => setMobilePanelOpen((o) => !o)}
              className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-white"
              aria-label="Afficher ou réduire le panneau"
            >
              {mobilePanelOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Drawer Content */}
          {mobilePanelOpen && (
            <div className="p-3 max-h-[34vh] overflow-y-auto space-y-2.5">
              {mobileTab === 'summary' ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white leading-tight">{currentChapter.title}</h2>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">
                      {currentChapter.pages}
                    </span>
                  </div>

                  <div className="bg-slate-900/90 border-l-2 border-sky-400 rounded-r-lg p-2 text-[11px] font-mono text-sky-200">
                    {currentChapter.formula}
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300 leading-snug">
                    {currentChapter.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {currentChapter.index === 7 && (
                    <div className="pt-1.5 flex items-center gap-2">
                      <button
                        onClick={() => setVMorph(0)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                          vMorph === 0
                            ? 'bg-sky-400 text-slate-950 border-white'
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}
                      >
                        Cascade (p. 45)
                      </button>
                      <button
                        onClick={() => setVMorph(1)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                          vMorph === 1
                            ? 'bg-indigo-500 text-white border-white'
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}
                      >
                        Modèle en V (p. 47)
                      </button>
                    </div>
                  )}
                </>
              ) : (
                selectedNode && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-white">{selectedNode.label}</div>
                      <span className="text-[11px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-amber-300">
                        PDF p.{selectedNode.page}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{selectedNode.role}</p>

                    <div className="pt-1.5 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
                      {currentChapter.nodes.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleSelectNode(n)}
                          className={`px-2 py-1 rounded-md text-[11px] whitespace-nowrap border shrink-0 ${
                            n.id === selectedNodeId
                              ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {n.label}
                        </button>
                      ))}
                    </div>
                  </>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM BAR: SIMPLE STEPPER & PROGRESS */}
      <footer className="relative z-20 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-3 sm:px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => selectChapter(chapterIdx - 1)}
            disabled={chapterIdx === 0}
            className="p-2 sm:p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-slate-200"
            title="Chapitre précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="px-3 py-1.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs flex items-center gap-1.5"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Auto-Résumé'}</span>
          </button>

          <button
            onClick={() => selectChapter(chapterIdx + 1)}
            disabled={chapterIdx === CHAPTERS.length - 1}
            className="p-2 sm:p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-slate-200"
            title="Chapitre suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 8-Step Progress Bar */}
        <div className="flex-1 max-w-xl flex items-center gap-1 sm:gap-1.5">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => selectChapter(idx)}
              className="flex-1 h-2 sm:h-2.5 rounded-full transition-all"
              style={{
                backgroundColor: idx <= chapterIdx ? ch.accentColor : '#1e293b',
                opacity: idx === chapterIdx ? 1 : idx < chapterIdx ? 0.65 : 0.35
              }}
              title={ch.title}
            />
          ))}
        </div>

        <div className="text-[11px] sm:text-xs font-mono text-slate-400 shrink-0">
          {chapterIdx + 1}/8 <span className="hidden sm:inline">({currentChapter.pages})</span>
        </div>
      </footer>

      {/* FRENCH STUDENT ONBOARDING / WELCOME SCREEN MODAL */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 my-auto">
            {/* Course Badge & Close */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>ISET Kélibia • Résumé Interactif 3D</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  Chapitre 1 : Génie Logiciel & Cycle de Vie
                </h1>
                <p className="text-xs text-slate-400">
                  Cours de M. Houssem Jbeli (53 pages) résumé en 8 fiches visuelles pour réviser rapidement sur téléphone ou PC.
                </p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Simple Steps for the Student */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Comment utiliser cette interface pour réviser ?
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="flex items-start gap-3 bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-sky-400" />
                      Parcourir les 8 Fiches de Révision
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Utilisez la barre du haut ou les flèches en bas pour passer d'un thème à l'autre. Chaque fiche résume <strong>la formule clé + les 3 points essentiels</strong> du cours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Hand className="w-3.5 h-3.5 text-purple-400" />
                      Manipuler le Schéma en 3D
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      <strong>Sur Mobile :</strong> glissez avec 1 doigt pour tourner la scène et pincez à 2 doigts (ou boutons +/-) pour zoomer. <strong>Sur PC :</strong> clic gauche + glisser et molette.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5 text-emerald-400" />
                      Cliquer sur un Objet ou une Étiquette
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Touchez n'importe quel élément 3D (ex: <em>Modularité, Architecte, Modèle en V</em>) pour afficher immédiatement <strong>son rôle exact et la page correspondante du PDF</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Start Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => setShowWelcome(false)}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs sm:text-sm text-center shadow-lg transition-all"
              >
                Commencer la révision (Fiche 1/8)
              </button>
              <button
                onClick={() => {
                  setShowWelcome(false);
                  setIsPlaying(true);
                }}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current text-sky-400" />
                <span>Lecture Auto</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}