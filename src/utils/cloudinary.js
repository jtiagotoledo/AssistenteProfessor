export const uploadToCloudinary = async (imageUri,idUsuario,nomeClasse,numAluno,nomeAluno) => {
    const data = new FormData();
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${nomeClasse.replace(" ", "_")}_${numAluno.replace(" ", "_")}_${nomeAluno.replace(" ", "_")}.jpg`,
    });
    data.append('upload_preset', 'assistenteProfessor_foto_alunos'); // Seu upload preset
    data.append('cloud_name', 'dzgk2rwpx'); 
    data.append('folder', idUsuario);

    const res = await fetch('https://api.cloudinary.com/v1_1/dzgk2rwpx/image/upload', {
      method: 'POST',
      body: data,
    });
  
    const json = await res.json();
    return json.secure_url; // URL da imagem no Cloudinary
  };
  