FROM ubuntu:24.04
MAINTAINER Ching367436

RUN apt-get update && \
    DEBAIN_FRONTEND=noninteractive apt-get install -qy xinetd

RUN DEBAIN_FRONTEND=noninteractive apt-get install -qy python3
RUN DEBAIN_FRONTEND=noninteractive apt-get install -qy python3-cryptography

RUN useradd -m kon
RUN chown -R root:root /home/kon
RUN chmod -R 755 /home/kon

CMD ["/usr/sbin/xinetd", "-dontfork"]
