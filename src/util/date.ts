import { Timestamp } from "../../pb/google/protobuf/timestamp";

export const convertTimestampToDate = (timestamp: Timestamp | undefined): string => {
  if (!timestamp) {
    return '';
  }

  const date = new Date(Number(timestamp.seconds) * 1000);

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
