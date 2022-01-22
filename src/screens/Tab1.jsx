import * as React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';

const Heading = styled(Text)`
  text-align: center;
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: bold;
`;

export default function Tab1() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Heading>Tab1</Heading>
    </View>
  );
}
