import React from 'react'
import { Grid, Container, Checkbox } from 'semantic-ui-react'

export default ({ enabled, onChange }) => {
  return (
    <Container className="header" style={{ padding: '15px', background: '#2185d0', color: 'white' }}>
      <Grid>
        <Grid.Column width={12} verticalAlign="middle">
          <h2 style={{ margin: 0, color: 'white' }}>Bandwidth Hero</h2>
        </Grid.Column>
        <Grid.Column width={4} verticalAlign="middle" textAlign="right">
          {onChange && <Checkbox toggle checked={enabled} onChange={onChange} />}
        </Grid.Column>
      </Grid>
    </Container>
  )
}
