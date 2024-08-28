import { Link } from 'react-router-dom';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper} from "@mui/material";

function GroupsList({groupsData})
{
    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: '16px auto' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Membros</TableCell>
                <TableCell>Atividades</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupsData && groupsData.map((group) => (
                <TableRow key={group.id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }} component={Link} to={`/GroupMembers/${group.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <TableCell>{group.nome}</TableCell>
                  <TableCell>{group.quantidade_membros}</TableCell>
                  <TableCell>{group.quantidade_atividades}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    );
}

export default GroupsList;