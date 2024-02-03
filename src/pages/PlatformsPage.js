import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import ListOfPlatforms from '../components/ui/js/find_platforms_page/ListofPlatforms';

function PlatformsPage() {
  return (
    <div>
      <br />
      <Container>
        <Row>

          <Col>
            <ListOfPlatforms />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PlatformsPage;
