import { useParams } from 'react-router-dom';
import PageContainerGroup from '../../components/PageContainerGroup';

function GroupActivities()
{
    const { id } = useParams();

    return (
        <PageContainerGroup group_id={ id } title="Atividades do Grupo">
            <h2> Lista de Atividades do Grupo { id } </h2>
            {/* Add your activity list and buttons here */}
        </PageContainerGroup>
    );
}

export default GroupActivities;