FROM ruby:3.3.0-slim

# Instalar dependências de sistema necessárias para o Rails e Postgres
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs git

WORKDIR /app

# Copia e instala gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

EXPOSE 3000

CMD ["bash", "-c", "rm -f tmp/pids/server.pid && bundle exec rails server -b 0.0.0.0"]
