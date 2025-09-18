import OrgNode from '../OrgNode';

export default function OrgNodeExample() {
  const sampleNode = {
    id: '1',
    name: 'Mohammed Ahmad',
    title: 'CEO',
  };

  return (
    <OrgNode 
      node={sampleNode} 
      onEdit={() => console.log('Edit triggered')}
      onDelete={() => console.log('Delete triggered')} 
      onAddChild={() => console.log('Add child triggered')}
    />
  );
}