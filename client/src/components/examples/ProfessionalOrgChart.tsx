import ProfessionalOrgChart from '../ProfessionalOrgChart';

export default function ProfessionalOrgChartExample() {
  const orgData = [
    { id: '1', name: 'Mansoor Ahmad', title: 'CEO' },
    { id: '2', name: 'Basharat Gill', title: 'HRO', parentId: '1' },
    { id: '3', name: 'Dr Mudasar Hussain', title: 'Pathologist', parentId: '1' },
    { id: '4', name: 'Danish Gill', title: 'Lab Manager', parentId: '2' },
    { id: '5', name: 'Muhammad Waseem', title: 'Account Manager', parentId: '2' },
    { id: '6', name: 'Moon Anwar', title: 'Lab Technologist', parentId: '3' },
    { id: '7', name: 'Mudasir', title: 'Senior Technician', parentId: '4' },
    { id: '8', name: 'Muhammad Adeel', title: 'Jr Lab Technician', parentId: '4' },
    { id: '9', name: 'Saba Noor', title: 'Lab Assistant', parentId: '5' },
    { id: '10', name: 'Sahar Nasir', title: 'Lab Technologist', parentId: '6' },
    { id: '11', name: 'Bisma', title: 'Phlebotomist', parentId: '6' }
  ];

  return (
    <div className="w-full h-screen">
      <ProfessionalOrgChart nodes={orgData} />
    </div>
  );
}