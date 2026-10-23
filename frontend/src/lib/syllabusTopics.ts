export interface SyllabusTopicItem {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  exam_focus: string;
}

export const SYLLABUS_TOPICS: SyllabusTopicItem[] = [
  { id: 'TOP_01', subject: 'Physics', chapter: 'Mechanics', topic: 'Kinematics & Vector Motion', exam_focus: 'JEE/NEET' },
  { id: 'TOP_02', subject: 'Physics', chapter: 'Mechanics', topic: 'Rotational Dynamics & Torque', exam_focus: 'JEE/NEET' },
  { id: 'TOP_03', subject: 'Physics', chapter: 'Electrodynamics', topic: 'Electrostatics & Coulomb Law', exam_focus: 'JEE/NEET' },
  { id: 'TOP_04', subject: 'Physics', chapter: 'Thermodynamics', topic: 'Kinetic Theory of Gases & Heat', exam_focus: 'JEE/NEET' },
  { id: 'TOP_05', subject: 'Chemistry', chapter: 'Organic Chemistry', topic: 'General Organic Chemistry (GOC)', exam_focus: 'JEE/NEET' },
  { id: 'TOP_06', subject: 'Chemistry', chapter: 'Physical Chemistry', topic: 'Chemical Kinetics & Rate Laws', exam_focus: 'JEE/NEET' },
  { id: 'TOP_07', subject: 'Chemistry', chapter: 'Inorganic Chemistry', topic: 'Coordination Compounds & Ligands', exam_focus: 'JEE/NEET' },
  { id: 'TOP_08', subject: 'Chemistry', chapter: 'Physical Chemistry', topic: 'Thermodynamics & Equilibrium', exam_focus: 'JEE/NEET' },
  { id: 'TOP_09', subject: 'Mathematics', chapter: 'Calculus', topic: 'Definite Integration & Area Under Curves', exam_focus: 'JEE/NEET' },
  { id: 'TOP_10', subject: 'Mathematics', chapter: 'Algebra', topic: 'Quadratic Equations & Complex Numbers', exam_focus: 'JEE/NEET' },
  { id: 'TOP_11', subject: 'Mathematics', chapter: 'Geometry', topic: 'Vectors & 3D Geometry Lines/Planes', exam_focus: 'JEE/NEET' },
  { id: 'TOP_12', subject: 'Mathematics', chapter: 'Calculus', topic: 'Differential Equations & Growth Models', exam_focus: 'JEE/NEET' },
  { id: 'TOP_13', subject: 'Biology', chapter: 'Genetics', topic: 'Principles of Inheritance & Variation', exam_focus: 'NEET' },
  { id: 'TOP_14', subject: 'Biology', chapter: 'Physiology', topic: 'Human Circulatory & Excretory System', exam_focus: 'NEET' }
];
