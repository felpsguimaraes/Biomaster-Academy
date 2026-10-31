import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('Seed já executado. Pulando registros iniciais.');
    return;
  }

  const course1 = await prisma.course.create({
    data: {
      name: 'Matemática Aplicada',
      description: 'Módulos de álgebra, cálculo e raciocínio lógico.',
      subjects: {
        create: [
          {
            name: 'Álgebra Linear',
            description: 'Matrizes, vetores e sistemas lineares.',
            materials: {
              create: [
                {
                  title: 'Aula 01 - Vetores',
                  type: 'PDF',
                  url: 'https://example.com/aula-vetores.pdf',
                  content: 'Material introdutório em vetores.'
                }
              ]
            }
          },
          {
            name: 'Cálculo I',
            description: 'Derivadas, limites e integrais.',
            materials: {
              create: [
                {
                  title: 'Aula 02 - Derivadas',
                  type: 'VIDEO',
                  url: 'https://example.com/derivadas.mp4',
                  content: 'Conteúdo de derivadas e interpretação gráfica.'
                }
              ]
            }
          }
        ]
      }
    }
  });

  const course2 = await prisma.course.create({
    data: {
      name: 'Programação Web',
      description: 'Front-end, back-end e arquitetura de aplicações.',
      subjects: {
        create: [
          {
            name: 'Estruturas Web',
            description: 'HTML, CSS, JS e organização de interfaces.',
            materials: {
              create: [
                {
                  title: 'Aula 01 - HTML semântico',
                  type: 'ARTICLE',
                  content: 'Introdução ao HTML semântico e boas práticas.'
                }
              ]
            }
          }
        ]
      }
    }
  });

  await prisma.user.createMany({
    data: [
      {
        name: 'João da Silva',
        email: 'joao@biomaster.com',
        password: '$2a$10$j3fGPpG5P8h0bKXgq4o0h.1v8aFafOaixz7eM6vZr2uHj2eYQmW0C',
        role: 'STUDENT'
      },
      {
        name: 'Prof. Ana Oliveira',
        email: 'ana@biomaster.com',
        password: '$2a$10$j3fGPpG5P8h0bKXgq4o0h.1v8aFafOaixz7eM6vZr2uHj2eYQmW0C',
        role: 'TEACHER'
      },
      {
        name: 'Maria Admin',
        email: 'admin@biomaster.com',
        password: '$2a$10$j3fGPpG5P8h0bKXgq4o0h.1v8aFafOaixz7eM6vZr2uHj2eYQmW0C',
        role: 'ADMIN'
      }
    ]
  });

  const student = await prisma.user.findUnique({ where: { email: 'joao@biomaster.com' } });

  if (student) {
    await prisma.enrollment.createMany({
      data: [
        { userId: student.id, subjectId: course1.subjects[0].id, status: 'active' },
        { userId: student.id, subjectId: course2.subjects[0].id, status: 'active' }
      ]
    });
  }

  console.log('Seed concluído com cursos, materiais e usuários iniciais.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
