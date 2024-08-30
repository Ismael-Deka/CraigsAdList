import { useParams } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';

import SearchTabs from '../components/ui/js/search_page/SearchTabs';

function SearchPage() {
  const params = useParams();
  const { searchType } = params;
  return (
    <div>
      <br />
      <Container>
        <Row>

          <Col>
            <SearchTabs searchType={searchType} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SearchPage;
